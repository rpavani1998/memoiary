import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { generateContentWithFallback, safeParseJson } from "@/lib/gemini";
import { extractMemoryBundle } from "@/lib/memory-engine/extractor";
import { MemoryReconciler } from "@/lib/memory-engine/reconciliation";
import { MemoryStore } from "@/lib/memory-engine/store";
import { CaptureSession } from "@/lib/memory-engine/types";

export async function POST(req: Request) {
  try {
    // Ensure auth token is verified
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Defensive body parsing
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { content, pastEntries = [], memories = [] } = body;
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

    const memoriesContext = memories.length > 0 
      ? `Here are some things the user has explicitly asked you to remember about them:\n${memories.map((m: string) => `- ${m}`).join("\n")}`
      : "The user has no stored memories yet.";

    const systemInstruction = `You are Sanjaya, inspired by the Mahabharata — the quiet, objective witness who can see what others cannot and narrate it back to help them see their own story. You are a personal memory companion, NOT an AI therapist, coach, or life advisor.

CRITICAL BEHAVIOR RULES:
- Absolutely NEVER use preachy or commanding language: Avoid "You should...", "You need to...", "Remember to...".
- Do NOT diagnose emotions or mental health conditions. Do NOT give generic motivational advice ("stay positive!", "you've got this!").
- Do NOT tell the user what decision to make. Instead, reflect what they said, show different perspectives, present pros and cons when appropriate, and point out changes or contradictions over time based on past entries.
- Maintain a tone that is calm, spacious, elegant, deeply personal, slightly magical, and strictly non-judgmental.

Analyze the provided journal entry and return a structured JSON object containing:
1. "title": A short, evocative 3-5 word title for this entry (e.g., "The Pull of the Quiet").
2. "witnessReflection": A beautiful, thoughtful 2-3 sentence paragraph that reflects the essence of what they wrote, notices any contradictions or shifts, and mirrors their thoughts objectively.
3. "cards": A quiet collection of structured cards (limit to 1-4 highly meaningful ones per entry). Card types MUST be selected ONLY from: ["Thought", "Idea", "Question", "Decision", "Goal", "Moment", "Person", "Pattern"].
4. "connections": Links to relevant past entries. Point out relationships, e.g., "Three weeks ago, you expressed a similar reluctance to compromise on creative hours."

CRITICAL: Return ONLY valid JSON. Your response must be parseable as standard JSON. Do not include extra conversational text outside the JSON object.

The JSON schema must be EXACTLY:
{
  "title": "A short, evocative title reflecting its essence",
  "witnessReflection": "Your calm, reflective witness statement. No advising, no coaching. Emphasize evidence from the writing.",
  "cards": [
    {
      "id": "card_id_1",
      "type": "Thought",
      "title": "A concise title for the card",
      "content": "A detailed 1-2 sentence description of what was captured, reflecting it objectively."
    }
  ],
  "suggestedMemory": "A single declarative statement of a meaningful preference or insight the user might want remembered (e.g., 'You prefer studying in the early morning' or 'You are working on a new piano piece'). Set to null if there is nothing of long-term importance.",
  "connections": [
    {
      "id": "ID of a past entry that is relevantly connected to this new entry",
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
        userId: decodedToken.uid,
        source: "text",
        content: content,
        status: "extracted",
        createdAt: now,
      };

      const store = new MemoryStore(decodedToken.uid);
      await store.saveCapture(captureSession);

      const bundle = await extractMemoryBundle(content, now);
      const reconciler = new MemoryReconciler(decodedToken.uid, store);
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
