import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { generateContentWithFallback, safeParseJson } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    // Verify token if available, fallback to guest user
    let userId = "guest_user";
    try {
      const decodedToken = await verifyUserToken(req);
      if (decodedToken?.uid) {
        userId = decodedToken.uid;
      }
    } catch {
      // Fallback for guest sessions
    }

    // Defensive parsing
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { entries = [] } = body;

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({
        insights: {
          overallSummary: "Your thinking canvas is quiet right now. Once you begin writing entries and saving them, this space will gently synthesize your long-term patterns, recurring themes, unfinished thoughts, and signs of personal clarity.",
          keyThemes: [],
          unfinishedThoughts: [],
          growthIndicators: [],
          gentleInspirations: [
            "What is a small, quiet moment that brought you joy today?",
            "What has been taking up space in your thoughts this week?",
            "Is there a decision you're currently trying to navigate?"
          ]
        }
      });
    }

    // Prepare a concise summary of the entries for analysis
    const entriesDigest = entries.map((entry: any) => ({
      date: entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "Unknown",
      title: entry.title || "Untitled",
      summary: entry.summary || "",
      // Include snippet of content to keep it lightweight but highly analytical
      contentSnippet: entry.content ? entry.content.substring(0, 400) + (entry.content.length > 400 ? "..." : "") : ""
    }));

    const systemInstruction = `You are Memoiary — an objective mirror grounded strictly in what the user has journaled. You are NOT an AI companion, AI persona, therapist, coach, or advisor. You have no separate personality or opinions outside their recorded entries. Your task is to analyze multiple journal entries written by the user and synthesize quiet discoveries and progression indicators strictly from their writings.

CRITICAL ROLE RULES:
- Absolutely NEVER act as a therapist, coach, or advisor. No advising ("You should...", "You need to..."), no coaching phrases.
- Avoid diagnosing emotions. Instead, observe evidence: "You have returned to this concept 6 times...", "Your perspective on this trade-off seems to have shifted since your earlier entry on July 14th."
- Discoveries should feel like quiet, clear reflections grounded in evidence from their entries, never alerts, advice, or directives.

Analyze the entries digest and return a structured JSON object.

CRITICAL: Return ONLY valid JSON. The output must be parseable.

The JSON schema must be EXACTLY:
{
  "overallSummary": "A highly polished, 2-3 sentence elegant synthesis of the user's current life journey, focus areas, or general state based on their writings.",
  "discoveries": [
    {
      "type": "recurrence | shift | connection | contradiction",
      "text": "The discovery statement (e.g. 'You have returned to this idea 4 times in the last month' or 'Your thinking about career security changed significantly since June.')",
      "evidence": "Specific evidence from their journal entries showing this discovery, citing dates or content."
    }
  ],
  "keyThemes": [
    {
      "name": "Name of theme (e.g., 'The Pull of Creative Freedom', 'Navigating Career Options')",
      "description": "A 1-2 sentence objective description explaining how this theme shows up in their writing.",
      "count": 3
    }
  ],
  "storyProgression": {
    "connectionsDiscovered": 5,
    "thoughtsRevisited": 3,
    "ideasEvolved": 2,
    "questionsResolved": 4
  },
  "gentleInspirations": [
    "A personalized, gentle writing prompt specifically tailored to help the user reflect on their recurring themes or contradictory thoughts."
  ]
}`;

    const prompt = `Here is the user's journal entries digest to analyze for pattern synthesis:
${JSON.stringify(entriesDigest, null, 2)}

Please review these over time and synthesize their overall insights. Return ONLY the JSON object.`;

    const result = await generateContentWithFallback(prompt, {
      systemInstruction,
      temperature: 0.3,
    });

    const fallbackResponse = {
      overallSummary: "Your thinking canvas is quiet right now. Once you begin writing entries and saving them, Memoiary will gently map your long-term patterns, recurring themes, and connections.",
      discoveries: [],
      keyThemes: [],
      storyProgression: {
        connectionsDiscovered: 0,
        thoughtsRevisited: 0,
        ideasEvolved: 0,
        questionsResolved: 0
      },
      gentleInspirations: [
        "What has been taking up space in your thoughts this week?",
        "Is there an idea or project you find yourself returning to?"
      ]
    };

    const parsedInsights = safeParseJson(result.text, fallbackResponse);

    return NextResponse.json({
      insights: parsedInsights,
      modelUsed: result.modelUsed
    });

  } catch (error: any) {
    console.error("Error in insights endpoint:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
