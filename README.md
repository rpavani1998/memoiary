# Memoiary — Autobiographical Memory Engine & Journal Reflection

A private autobiographical thinking space and memory engine powered by Next.js 15+, Google Cloud Run, Cloud Firestore, Firebase Authentication, and Gemini fallback ladders (`gemini-3.6-flash` → `gemini-3.1-pro-preview` → `gemini-3.1-flash-lite` → `gemini-flash-latest`). 

The system acts as a quiet, objective mirror adhering to the cardinal principle: **The system remembers more than it says**.

---

## 🏆 Hackathon Submission & Cloud Run Verification

- **Repository**: [github.com/rpavani1998/memoiary](https://github.com/rpavani1998/memoiary)
- **Mandatory Cloud Run Verification Label**: `dev-tutorial=cloud-run-ai-challenge`

---

## 🚀 Google Cloud Run Deployment Guide

### Prerequisites
- [Google Cloud Project](https://console.cloud.google.com/) with billing enabled.
- [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk) installed or [Google Cloud Shell](https://shell.cloud.google.com).
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

---

### Option A: Deployment via `gcloud` CLI / Google Cloud Shell (Recommended)

1. **Authenticate and set active project**:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_GCP_PROJECT_ID
   ```

2. **Deploy directly to Google Cloud Run from source with the mandatory verification label**:
   ```bash
   gcloud run deploy memoiary \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --labels dev-tutorial=cloud-run-ai-challenge \
     --set-env-vars "GEMINI_API_KEY=your_gemini_api_key_here,NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key"
   ```

3. **Output**: Cloud Run will build the container image and provide your public HTTPS endpoint:
   ```text
   Service [memoiary] revision [memoiary-00001-abc] has been deployed and is serving 100% of traffic.
   Service URL: https://memoiary-xxxxxx-uc.a.run.app
   ```

---

### Option B: Deployment via Google Cloud Console Web UI

1. Navigate to the **[Google Cloud Run Console](https://console.cloud.google.com/run)**.
2. Click **Create Service**.
3. Select **Deploy one revision from a source repository** (or connect your GitHub repo `rpavani1998/memoiary`).
4. Under **Authentication**, select **Allow unauthenticated invocations**.
5. Expand **Container, Volumes, Networking, Security**:
   - Scroll to **Labels**.
   - Click **Add Label**:
     - **Key**: `dev-tutorial`
     - **Value**: `cloud-run-ai-challenge`
   - Scroll to **Environment Variables**:
     - Add `GEMINI_API_KEY` = `your_gemini_api_key`
     - Add `NEXT_PUBLIC_FIREBASE_API_KEY` = `your_firebase_api_key`
6. Click **Create**.
7. Once deployment finishes, copy the generated public Service URL (`https://memoiary-xxxxxx-uc.a.run.app`).

---

### Secret Manager Integration (Optional for Production Secrets)

To store secrets in **Google Cloud Secret Manager** instead of plain environment variables:

```bash
# Create secret in Secret Manager
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant accessor permission to the Cloud Run service account
PROJECT_NUMBER=$(gcloud projects describe YOUR_GCP_PROJECT_ID --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Deploy referencing the secret
gcloud run deploy memoiary \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --labels dev-tutorial=cloud-run-ai-challenge \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

---

## 🔒 Cloud Firestore Security Rules

Memoiary enforces strict, owner-bound privacy isolation in Cloud Firestore. All user data (`captures`, `episodes`, `entities`, `relationships`, `emotions`, `states`, `learnings`, `patterns`, `provenance`, `entries`, `memories`) is isolated under `/users/{userId}/...` and protected by owner authentication checks and document ID validation.

### Complete `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Default deny catch-all
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    // All memory collections belong strictly to the authenticated user's isolated document tree
    match /users/{userId} {
      allow read, write: if isOwner(userId);

      match /captures/{captureId} {
        allow read, write: if isOwner(userId) && isValidId(captureId);
      }

      match /episodes/{episodeId} {
        allow read, write: if isOwner(userId) && isValidId(episodeId);
      }

      match /entities/{entityId} {
        allow read, write: if isOwner(userId) && isValidId(entityId);
      }

      match /relationships/{relationshipId} {
        allow read, write: if isOwner(userId) && isValidId(relationshipId);
      }

      match /emotions/{emotionId} {
        allow read, write: if isOwner(userId) && isValidId(emotionId);
      }

      match /states/{stateId} {
        allow read, write: if isOwner(userId) && isValidId(stateId);
      }

      match /learnings/{learningId} {
        allow read, write: if isOwner(userId) && isValidId(learningId);
      }

      match /patterns/{patternId} {
        allow read, write: if isOwner(userId) && isValidId(patternId);
      }

      match /provenance/{provenanceId} {
        allow read, write: if isOwner(userId) && isValidId(provenanceId);
      }

      match /entries/{entryId} {
        allow read, write: if isOwner(userId) && isValidId(entryId);
      }

      match /memories/{memoryId} {
        allow read, write: if isOwner(userId) && isValidId(memoryId);
      }
    }
  }
}
```

### Deploying Rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 🛠 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rpavani1998/memoiary.git
   cd memoiary
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_firebase_project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_firebase_project_id"
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Test memory extraction pipeline**:
   ```bash
   npx tsx scripts/test-pipeline.ts
   ```

---

## 🏛 Technical Architecture & Key Features

- **Frontend**: Next.js 15+ App Router, Tailwind CSS, `motion` micro-interactions, serif typography, terracotta theme (`#DE5239`).
- **Multimodal AI Engine**:
  - Structured extraction of mood, intensity, entities (People, Places, Topics), and activities.
  - Silent memory retrieval across entire life timeline.
  - Intimate, reflective prose voice tuned to the user's journal persona.
- **Gemini Fallback Ladder**:
  - `gemini-3.6-flash` → `gemini-3.1-pro-preview` → `gemini-3.1-flash-lite` → `gemini-flash-latest`
- **Memory Engine Core** (`/lib/memory-engine`):
  - **Extractor**: Structured entity & episode resolution.
  - **Retriever**: Hybrid graph and temporal memory context retrieval.
  - **Person Graph**: Trait tracking & visual identity cards (`PERSON_VISUAL_REGISTRY`).
  - **Reflection Chatboard**: Interactive thread history, saved threads, and voice-to-text input.

---

## 📄 License

MIT License — free to use and extend.
