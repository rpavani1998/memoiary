import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the server-side API Key
// Initialize the GoogleGenAI client (supports Vertex AI native mode on Cloud Run and API Key mode locally)
const getAiClient = () => {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.PROJECT_ID || process.env.GCP_PROJECT;
  const region = process.env.GOOGLE_CLOUD_REGION || process.env.LOCATION || process.env.REGION || "us-central1";
  const apiKey = process.env.GEMINI_API_KEY;

  // On Cloud Run (where K_SERVICE is present) or when GCP Project is set, use Vertex AI mode (ADC, zero API key required)
  if (process.env.K_SERVICE || process.env.NODE_ENV === "production" || projectId) {
    try {
      return new GoogleGenAI({
        vertexai: true,
        project: projectId,
        location: region
      });
    } catch (err) {
      console.warn("Vertex AI native initialization note:", err);
    }
  }

  // Fallback to API Key mode if GEMINI_API_KEY is available (e.g. local development)
  if (apiKey) {
    return new GoogleGenAI({ apiKey });
  }

  // Native Vertex AI fallback
  return new GoogleGenAI({
    vertexai: true,
    location: region
  });
};

// Resilient fallback ladder ordered by availability, speed, and suitability
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest"
];

interface GenerateOptions {
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
  temperature?: number;
}

/**
 * Executes a generation request with a robust fallback ladder.
 * Sequentially attempts models in the fallback chain when encountering errors.
 */
export async function generateContentWithFallback(
  contents: string | any[],
  options: GenerateOptions = {}
): Promise<{ text: string; modelUsed: string }> {
  const ai = getAiClient();
  let lastError: any = null;

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const config: any = {};
        if (options.systemInstruction) {
          config.systemInstruction = options.systemInstruction;
        }
        if (options.temperature !== undefined) {
          config.temperature = options.temperature;
        }
        if (options.responseMimeType) {
          config.responseMimeType = options.responseMimeType;
        }
        if (options.responseSchema) {
          config.responseSchema = options.responseSchema;
        }

        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });

        if (response && response.text) {
          return {
            text: response.text,
            modelUsed: model,
          };
        }
      } catch (error: any) {
        lastError = error;
        if (error?.message?.includes("429")) {
          // Free tier rate limit wait
          await new Promise((r) => setTimeout(r, 12000));
          continue;
        } else if (attempt === 0 && error?.message?.includes("503")) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        console.warn(`Model ${model} failed (attempt ${attempt + 1}):`, error?.message || error);
      }
    }
  }

  throw new Error(`All models in the fallback ladder failed. Last error: ${lastError?.message || lastError}`);
}

/**
 * Helper to safely parse JSON from Gemini's response, supporting both clean JSON 
 * and Markdown codeblocks.
 */
export function safeParseJson<T>(text: string, fallback: T): T {
  try {
    // Attempt straight parse
    return JSON.parse(text.trim()) as T;
  } catch {
    try {
      // Look for ```json ... ``` blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1].trim()) as T;
      }
    } catch {
      // Look for first '{' and last '}'
      try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          const jsonSub = text.substring(start, end + 1);
          return JSON.parse(jsonSub.trim()) as T;
        }
      } catch (innerError) {
        console.error("Defensive JSON parsing failed:", innerError);
      }
    }
  }
  return fallback;
}
