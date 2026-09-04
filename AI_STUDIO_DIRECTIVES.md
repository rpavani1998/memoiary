# Google AI Studio — Custom Directives & Security Constitution

This document contains the foundational **System Directives and Security Directives** configured in **Google AI Studio** for the creation of **Memoiary: Personal Memory Engine & Journal**.

---

## Directive 1: Threat Modeling & Security Principles
- **Default Deny Strategy**: All data access controls must default to deny (`allow read, write: if false;`) unless explicitly authorized under an authenticated user's isolated subcollection path `/users/{userId}/...`.
- **Zero Cross-User Leakage**: No global query or unauthenticated document read is permitted. Every Firestore read/write must assert `request.auth.uid == userId`.
- **Zero Hardcoded Secrets**: Under no circumstances should `GEMINI_API_KEY`, service account keys, or database credentials be hardcoded in frontend client code or checked into git repository files.

---

## Directive 2: Secure Secret Management
- API Keys must strictly be loaded server-side via **Google Cloud Secret Manager** (`GEMINI_API_KEY`) or runtime server environment variables.
- AI inferences must be executed through server-side Next.js API route handlers (`/api/gemini/...` or `/api/v1/...`) to prevent exposing API keys to the browser context.

---

## Directive 3: Database & Data Schema Directives
- User data model must adopt subcollection partitioning:
  - `/users/{userId}/captures/{captureId}`
  - `/users/{userId}/episodes/{episodeId}`
  - `/users/{userId}/entities/{entityId}`
  - `/users/{userId}/relationships/{relationshipId}`
  - `/users/{userId}/clarifications/{clarificationId}`
- Document IDs must satisfy `isValidId()` pattern matching `^[a-zA-Z0-9_\-]+$` with maximum length 128 bytes to prevent path injection vulnerabilities.

---

## Directive 4: AI Model Fallback & Resiliency Directive
- When interacting with Gemini API, standard implementations must construct a resilient fallback ladder:
  1. `gemini-3.6-flash` (Primary low-latency model)
  2. `gemini-3.1-pro-preview` (Multimodal deep reasoning model)
  3. `gemini-3.1-flash-lite` (Lightweight fallback model)
  4. `gemini-flash-latest` (High-availability general fallback)
- Inferences must handle rate limits and transient errors gracefully without crashing the UI.
