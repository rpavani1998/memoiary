# Personal Memory Engine & Sanjaya Journal

A private autobiographical thinking space and memory engine powered by Google Cloud, Firebase Firestore, Firebase Authentication, and Gemini resilient fallback ladders. The system understands deeply, remembers accurately, and acts as a quiet sounding board adhering to the cardinal principle: **The system remembers more than it says**.

---

## Technical Architecture

- **Frontend**: Next.js 15+ App Router, Tailwind CSS, and `motion` (Framer Motion) microinteractions.
- **Memory Engine Layer** (`/lib/memory-engine`):
  - **Extractor**: Multimodal & structured entity/episode extraction with temporal resolution and emotional attribution.
  - **Consistency Engine**: Epistemic contradiction detection, entity mismatch identification, ambiguity resolution, and gentle clarification generation.
  - **Reconciler**: Graph reconciliation with entity resolution, historical relationship transitions (`validFrom`, `validTo`), belief evolution, state superseding, and clarification resolution.
  - **Retriever**: Hybrid graph, temporal, entity-grounded, and importance-weighted context retrieval.
  - **Reflection Engine**: Three-level conversational mirror and connector without unsolicited advice or clinical diagnosing.
  - **Maintenance**: Background candidate pattern mining and duplicate entity detection.
- **RESTful API v1** (`/api/v1/...`):
  - `POST /api/v1/capture` & `GET /api/v1/capture`: Unified multi-channel ingestion & capture history with real-time consistency check.
  - `GET /api/v1/clarifications`: List pending/resolved clarification candidates.
  - `POST /api/v1/clarifications/{id}/respond`: Confirm, reject, correct (freeform), or dismiss clarification.
  - `GET /api/v1/test-suite`: Automated 10-point behavioral verification test runner.
  - `GET /api/v1/capture/{id}`: Capture details, status, and derived memory bundle.
  - `POST /api/v1/capture/media`: Multimodal asset ingestion (audio, screenshot, image, document).
  - `GET /api/v1/entities` & `POST /api/v1/entities`: Filtered entity querying and manual entity creation.
  - `GET /api/v1/entities/{id}` & `PATCH` & `DELETE`: Entity facts, graph relationships, and lifecycle management.
  - `GET /api/v1/entities/{id}/timeline`: Chronological autobiographical episode timeline.
  - `GET /api/v1/relationships/{id}`: Relationship status and validity history.
  - `POST /api/v1/retrieve`: Context retrieval for conversational grounding.
  - `POST /api/v1/reflect`: Grounded conversational reflection engine.
  - `PATCH /api/v1/memories/{id}` & `DELETE`: User memory corrections and provenance auditing.
  - `POST /api/v1/maintenance`: Pattern mining and deduplication maintenance tasks.
- **Database**: Strictly private, owner-isolated Google Cloud Firestore.
- **Cognitive Layer**: `@google/genai` TypeScript SDK executing a resilient fallback loop over dynamic model ladders:
  - Primary: `gemini-2.5-flash`
  - High-Availability Fallback: `gemini-2.5-pro`
  - Dynamic Fallback: `gemini-3.6-flash`
  - Reasoning Fallback: `gemini-3.7-flash`

---

## 1. Firebase Firestore Security Configuration

The Firestore rules enforce complete owner-bound isolation across all user subcollections (`captures`, `episodes`, `entities`, `relationships`, `emotions`, `states`, `learnings`, `patterns`, `provenance`, `entries`, `memories`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);

      match /{collection}/{docId} {
        allow read, write: if isOwner(userId) && isValidId(docId);
      }
    }
  }
}
```

Deploy the rules securely using Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 2. Cloud Secret Manager Integration

Ensure that the default Cloud Run Compute Service Account or your custom service account has the necessary Secret Manager Accessor permissions.

```bash
# Create the secret holding your API Key
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant Secret Manager Secret Accessor role to the Cloud Run runtime service account
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 3. Unified Production Deployment (Cloud Run)

Compile the standalone build and deploy the container service to Google Cloud Run:

```bash
# Build the Next.js production standalone package
npm run build

# Deploy the service directly from sources
gcloud run deploy personal-gemini-journal \
  --source=. \
  --region=us-central1 \
  --allow-unauthenticated \
  --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --update-labels=dev-tutorial=cloud-run-ai-challenge
```

---

## 4. Local Development

Copy and configure your local environmental settings:
```bash
cp .env.example .env.local
```

Populate the local credentials inside `.env.local`:
```env
GEMINI_API_KEY="AIzaSy..."
```

Launch the development server:
```bash
npm run dev
```
