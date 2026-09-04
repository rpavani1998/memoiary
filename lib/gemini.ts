import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the server-side API Key
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({ apiKey });
};

// Resilient fallback ladder ordered by availability, speed, and suitability
const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-3.6-flash"
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
    try {
      // Build generation config
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
      console.warn(`Model ${model} failed with error:`, error?.message || error);
      lastError = error;
      // Continue to next model in the fallback ladder
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
