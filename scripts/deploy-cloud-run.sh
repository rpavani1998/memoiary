#!/usr/bin/env bash
set -e

echo "================================================="
echo "  Deploying Memoiary to Google Cloud Run"
echo "================================================="

# Service configuration
SERVICE_NAME=${SERVICE_NAME:-"memoiary"}
REGION=${REGION:-"us-central1"}
LABEL="dev-tutorial=cloud-run-ai-challenge"

echo "Service Name: $SERVICE_NAME"
echo "Region:       $REGION"
echo "Required Label: $LABEL"
echo "-------------------------------------------------"

if [ -z "$GEMINI_API_KEY" ]; then
  echo "Note: GEMINI_API_KEY environment variable is not set locally."
  echo "Deploying source with mandatory challenge label..."
  gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --allow-unauthenticated \
    --labels "$LABEL"
else
  echo "Deploying source with GEMINI_API_KEY and mandatory challenge label..."
  gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --allow-unauthenticated \
    --labels "$LABEL" \
    --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY"
fi

echo "-------------------------------------------------"
echo "Deployment command completed successfully!"
