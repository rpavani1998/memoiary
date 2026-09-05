#!/usr/bin/env bash
set -e

echo "================================================="
echo "  Deploying Memoiary to Google Cloud Run (Vertex AI Native Mode)"
echo "================================================="

# Service configuration
SERVICE_NAME=${SERVICE_NAME:-"memoiary"}
REGION=${REGION:-"us-central1"}
LABEL="dev-tutorial=cloud-run-ai-challenge"

echo "Service Name:   $SERVICE_NAME"
echo "Region:         $REGION"
echo "Required Label: $LABEL"
echo "Authentication: Native Google Cloud IAM / Vertex AI (Zero API keys required)"
echo "-------------------------------------------------"

gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --labels "$LABEL"

echo "-------------------------------------------------"
echo "Deployment command completed successfully!"
