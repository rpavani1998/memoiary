import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY required");
  return new GoogleGenAI({ apiKey });
};

export async function POST(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) || {};
    const { mediaBase64, mimeType, mediaType, prompt } = body;

    if (!mediaBase64 || !mimeType) {
      return NextResponse.json({ error: "mediaBase64 and mimeType are required" }, { status: 400 });
    }

    const ai = getAiClient();

    const systemPrompt = getSystemPrompt(mediaType, prompt);

    const mediaPart = {
      inlineData: {
        mimeType,
        data: mediaBase64
      }
    };

    const textPart = {
      text: systemPrompt
    };

    const FALLBACK_MODELS = [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-3.6-flash",
      "gemini-3.1-flash-lite"
    ];

    let lastError: any = null;

    for (const model of FALLBACK_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [textPart, mediaPart] }],
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text || "{}");
          return NextResponse.json({
            success: true,
            result: parsed,
            modelUsed: model
          });
        }
      } catch (error: any) {
        console.warn(`Model ${model} failed:`, error?.message);
        lastError = error;
      }
    }

    throw new Error(`All models failed. Last error: ${lastError?.message}`);
  } catch (error: any) {
    console.error("Media processing error:", error);
    return NextResponse.json({ error: error?.message || "Media processing failed" }, { status: 500 });
  }
}

function getSystemPrompt(mediaType: string, customPrompt?: string): string {
  if (customPrompt) return customPrompt;

  switch (mediaType) {
    case "audio":
      return `You are Memoiary's audio analysis engine. Analyze this audio recording and extract:

1. TRANSCRIPTION: The full spoken text, word for word.
2. SPEAKER_EMOTION: The primary emotion detected in the speaker's voice (e.g., excited, reflective, anxious, joyful, melancholic, neutral).
3. TONE: The speaking tone (e.g., casual, urgent, contemplative, playful, vulnerable, formal).
4. SPEECH_PATTERNS: Note any interesting speech patterns (pauses, emphasis, laughter, sighs, pace changes).
5. KEY_ENTITIES: People, places, things mentioned in the speech.
6. SUMMARY: A 1-2 sentence summary of what was said.

Return ONLY valid JSON.`;

    case "image":
      return `You are Memoiary's image analysis engine. Analyze this photo/image and extract:

1. SCENE_DESCRIPTION: A detailed description of what's in the image.
2. PEOPLE: Names or descriptions of any people visible (if recognizable, describe them).
3. LOCATION_HINTS: Any clues about where this was taken (signs, landmarks, scenery, indoor/outdoor).
4. MOOD: The overall emotional mood of the scene.
5. OBJECTS: Key objects/items visible.
6. TEXT_IN_IMAGE: Any text visible in the image (signs, labels, screenshots).
7. TIME_HINTS: Any clues about when this was taken (lighting, season, time of day).
8. SUMMARY: A 1-2 sentence summary of the image's significance.

Return ONLY valid JSON.`;

    case "video":
      return `You are Memoiary's video analysis engine. Analyze this video and extract:

1. TRANSCRIPTION: If there is spoken audio, transcribe it.
2. SCENE_DESCRIPTION: A description of what happens in the video.
3. PEOPLE: People visible or heard in the video.
4. LOCATION_HINTS: Where this was filmed.
5. KEY_MOMENTS: Notable moments or events in the video (with approximate timestamps).
6. MOOD: The overall emotional tone.
7. AUDIO_ANALYSIS: Any music, sounds, or ambient audio detected.
8. SUMMARY: A 1-2 sentence summary of the video.

Return ONLY valid JSON.`;

    default:
      return `Analyze this media and extract all relevant information. Return ONLY valid JSON with a "summary" field and any other relevant fields.`;
  }
}
