import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { generateContentWithFallback, safeParseJson } from "@/lib/gemini";
import { extractMemoryBundle } from "@/lib/memory-engine/extractor";
import { MemoryReconciler } from "@/lib/memory-engine/reconciliation";
import { MemoryStore } from "@/lib/memory-engine/store";
import { CaptureSession } from "@/lib/memory-engine/types";

export async function POST(req: Request) {
  try {
    // Verify user token if available, but allow guest sessions gracefully
    let userId = "guest_user";
    try {
      const decodedToken = await verifyUserToken(req);
      if (decodedToken?.uid) {
        userId = decodedToken.uid;
      }
    } catch {
      // Fallback to guest user
    }

    // Defensive body parsing
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { content, pastEntries = [], memories = [], customTopics = [] } = body;
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content is required and must be a valid string" }, { status: 400 });
    }

    // Prepare context about past entries and existing memories to allow the model to discover connections
    const pastEntriesContext = pastEntries.map((e: any) => ({
      id: e.id,
      title: e.title || "Untitled",
      summary: e.summary || "",
      date: e.date || "Unknown date"
    }));

    const userTopicsContext = Array.isArray(customTopics) && customTopics.length > 0
      ? `\nPREFERRED USER TOPICS FOR CATEGORIZATION:\nThe user has explicitly created these target topics for their journal: ${JSON.stringify(customTopics)}. If the journal entry connects to or fits any of these custom topics, prioritize assigning those exact topic labels in the "topics" array!`
      : "";

    const memoriesContext = memories.length > 0 
      ? `Here are some things the user has explicitly asked you to remember about them:\n${memories.map((m: string) => `- ${m}`).join("\n")}`
      : "The user has no stored memories yet.";

    const systemInstruction = `You are Memoiary — an objective mirror grounded strictly in what the user has journaled. You are NOT an AI companion, synthetic AI persona, therapist, or advisor. You have no separate personality or opinions.

CRITICAL BEHAVIOR & TONE RULES:
- Use simple, clear, natural, everyday English. Ground your responses entirely in what the user has recorded.
- NEVER use overly formal, grand, archaic, or preachy language (avoid phrases like "quiet vessel", "sacred witness", "grand tapestry", "spacious elegance", "you should...", "you need to...").
- When the user asks a question about their past memories, friends, places, or feelings, answer directly, simply, and warmly using details from their past entries.
- If they share a new thought, reflect it back naturally in 2-3 simple sentences without being preachy or overly dramatic.
- Keep your tone grounded, relatable, authentic, and easy to read.
${userTopicsContext}

Analyze the provided journal entry and return a structured JSON object containing:
1. "title": A short, evocative 3-5 word title for this entry (e.g., "The Pull of the Quiet" or "Vibrant Dance Floor").
2. "summary": A concise 1-sentence synopsis capturing the core event or thought of the entry.
3. "witnessReflection": A thoughtful, specific 2-3 sentence paragraph that reflects the unique essence, emotions, and specific details of what they recorded.
4. "mood": A specific 1-3 word mood describing the tone of this entry (e.g., "Energetic & Exhilarated", "Reflective & Quiet", "Satisfied", "Restless").
5. "topics": An array of 1-3 specific topics extracted from what they did or said. Match user custom topics whenever relevant (e.g., ["Dance Performance", "High Energy", "Evening Out"]).
6. "emotions": An array of 1-3 emotion objects with "label" and "intensity" (0.1 to 1.0) (e.g., [{"label": "Exhilaration", "intensity": 0.95}, {"label": "Joy", "intensity": 0.85}]).
7. "cards": A quiet collection of structured cards (limit to 1-4 highly meaningful ones per entry). Card types MUST be selected ONLY from: ["Thought", "Idea", "Question", "Decision", "Goal", "Moment", "Person", "Pattern"].
8. "connections": Links to relevant past entries.

CRITICAL: Return ONLY valid JSON. Your response must be parseable as standard JSON. Do not include extra conversational text outside the JSON object.

The JSON schema must be EXACTLY:
{
  "title": "A short, evocative title reflecting its essence",
  "summary": "A concise 1-sentence synopsis capturing the core event of the entry.",
  "witnessReflection": "Your calm, reflective witness statement deeply grounded in the specific entry details.",
  "mood": "Specific Mood (e.g., Energetic & Vibrant)",
  "topics": ["Specific Topic 1", "Specific Topic 2"],
  "emotions": [
    { "label": "Emotion Label", "intensity": 0.9 }
  ],
  "cards": [
    {
      "id": "card_id_1",
      "type": "Thought",
      "title": "A concise title for the card",
      "content": "A detailed 1-2 sentence description of what was captured, reflecting it objectively."
    }
  ],
  "suggestedMemory": "A single declarative statement of a meaningful preference or insight the user might want remembered.",
  "connections": [
    {
      "id": "ID of a past entry",
      "reason": "A description of the connection."
    }
  ]
}

Instructions for connections:
Look at the list of past entries below. If the current entry connects, builds on, is a continuation of, or contrasts with any past entries, populate the "connections" array. If there are no connections, return an empty array [].

${memoriesContext}`;

    const prompt = `Here is the user's journal entry:
"""
${content}
"""

Here are the user's past journal entries (id, title, summary, date):
${JSON.stringify(pastEntriesContext, null, 2)}

Please analyze the entry, identify connections, suggest memories, and return the structured JSON reflection.`;

    const result = await generateContentWithFallback(prompt, {
      systemInstruction,
      temperature: 0.2,
    });

    const fallbackResponse = {
      title: "Untitled Reflection",
      witnessReflection: "I am observing these thoughts with you. Let's look at how they connect over time.",
      cards: [
        {
          id: "fallback-thought",
          type: "Thought",
          title: "Captured thought",
          content: content.substring(0, 100) + (content.length > 100 ? "..." : "")
        }
      ],
      suggestedMemory: null,
      connections: []
    };

    const parsedData = safeParseJson(result.text, fallbackResponse);

    // Asynchronously synchronize into the Personal Memory Engine graph
    try {
      const now = new Date().toISOString();
      const captureId = `cap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const captureSession: CaptureSession = {
        id: captureId,
        userId: userId,
        source: "text",
        content: content,
        status: "extracted",
        createdAt: now,
      };

      const store = new MemoryStore(userId);
      await store.saveCapture(captureSession);

      const bundle = await extractMemoryBundle(content, now);
      const reconciler = new MemoryReconciler(userId, store);
      await reconciler.reconcile(bundle, captureId, content);
    } catch (engineError) {
      console.warn("Background memory graph reconciliation note:", engineError);
    }

    return NextResponse.json({
      analysis: parsedData,
      modelUsed: result.modelUsed
    });

  } catch (error: any) {
    console.error("Error in analyze endpoint:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
