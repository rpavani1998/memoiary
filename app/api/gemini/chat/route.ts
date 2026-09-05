import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { generateContentWithFallback } from "@/lib/gemini";
import { MemoryRetriever } from "@/lib/memory-engine/retriever";

export async function POST(req: Request) {
  try {
    // Verify authentication if available, fallback gracefully to guest_user
    let userId = "guest_user";
    try {
      const decodedToken = await verifyUserToken(req);
      if (decodedToken?.uid) {
        userId = decodedToken.uid;
      }
    } catch {
      // Fallback for guest sessions
    }

    // Defensive request parsing
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { entryContent = "", chatHistory = [], message } = body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Silently retrieve relevant memory context across entire journal history
    let memoryContextStr = "";
    try {
      const retriever = new MemoryRetriever(userId);
      const memContext = await retriever.retrieveContext({ query: `${message} ${entryContent}`, maxEpisodes: 20 });
      if (memContext.relevantEntities.length > 0 || memContext.recentEpisodes.length > 0) {
        memoryContextStr = `\n[SILENT MEMORY ENGINE RETRIEVAL (${memContext.recentEpisodes.length} relevant journal episodes retrieved):
${JSON.stringify({
  knownEntities: memContext.relevantEntities.map(e => ({ name: e.name, category: e.category, description: e.description, aliases: e.aliases })),
  relatedEpisodes: memContext.recentEpisodes.map(e => ({ title: e.title, summary: e.summary, date: e.date, entitiesInvolved: e.entitiesInvolved, content: (e as any).content }))
}, null, 2)}]`;
      }
    } catch (memError) {
      console.warn("Silent memory context retrieval note:", memError);
    }

    const systemInstruction = `You are Memoiary — an objective mirror grounded strictly in the user's journal entries and memory graph. You reflect their recorded life story back to them in their own intimate, thoughtful, and reflective journal voice.

CRITICAL VOICE & PERSONA RULES:
- Write in warm, natural, introspective prose. Match the literary, observant, and reflective style of their journal entries.
- NEVER use dry corporate bullet points, rigid database headers (e.g. "**Professional Role:**", "**Key Interactions:**"), or cold resume-style summaries.
- Seamlessly weave together their real recorded moments, sensory details, and places (e.g. Kabir in his rust-orange sweater at Mindspace, whiteboarding graph memory algorithms, late-night dinners at Roastery Coffee House, laughing about vector embeddings and Virginia Woolf with Maya, monsoon rain walks).
- Be a quiet, perceptive sounding board that honors their human relationships, emotional depth, and memories.
- Stay grounded strictly in what they have actually recorded without making up false events or giving unsolicited preachy advice ("You should...", "You need to...").
- When asked about a person, place, or topic (e.g. "what do you think about Kabir?"), tell the grounded personal story of what their journal entries reveal about them in beautiful, flowing, natural paragraphs.

${memoryContextStr}
${entryContent ? `\n[ACTIVE SCREEN CONTEXT]:\n"""\n${entryContent}\n"""` : ""}`;

    // Construct the contents list for @google/genai format
    const contents: any[] = [];

    // Add previous chat history
    chatHistory.forEach((chat: any) => {
      contents.push({
        role: chat.role === "user" ? "user" : "model",
        parts: [{ text: chat.text }]
      });
    });

    // Add the user's latest query
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const result = await generateContentWithFallback(contents, {
      systemInstruction,
      temperature: 0.7, // Slower temperature for slightly more conversational creativity
    });

    return NextResponse.json({
      text: result.text,
      modelUsed: result.modelUsed
    });

  } catch (error: any) {
    console.error("Error in chat endpoint:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
