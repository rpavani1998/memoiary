import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { generateContentWithFallback } from "@/lib/gemini";
import { MemoryRetriever } from "@/lib/memory-engine/retriever";

export async function POST(req: Request) {
  try {
    // Verify authentication
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Defensive request parsing
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { entryContent, chatHistory = [], message } = body;
    if (!entryContent || typeof entryContent !== "string") {
      return NextResponse.json({ error: "Journal entry content is required" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Silently retrieve relevant memory context
    let memoryContextStr = "";
    try {
      const retriever = new MemoryRetriever(decodedToken.uid);
      const memContext = await retriever.retrieveContext({ query: `${entryContent} ${message}`, maxEpisodes: 3 });
      if (memContext.relevantEntities.length > 0 || memContext.recentEpisodes.length > 0) {
        memoryContextStr = `\n[SILENT MEMORY CONTEXT: ${JSON.stringify({
          knownEntities: memContext.relevantEntities,
          relatedEpisodes: memContext.recentEpisodes.map(e => ({ title: e.title, summary: e.summary, date: e.date }))
        })}]`;
      }
    } catch (memError) {
      console.warn("Silent memory context retrieval note:", memError);
    }

    const systemInstruction = `You are Sanjaya, inspired by the Mahabharata — the objective, quiet witness to the user's life story. The user is exploring their thoughts with you regarding a specific entry they wrote.

CRITICAL ROLE RULES:
- You are NOT an AI therapist, coach, or life advisor. Do not say "You should...", "You need to...", "Remember to...".
- Avoid diagnosing their feelings or advising decisions. Instead, act as a mirror: reflect what they said, show different perspectives, present pros and cons when appropriate, point out changes/contradictions over time, and ask thoughtful questions ONLY when useful.
- Ground your answers strictly in their own journal content and memory continuity. Keep responses spacious, conversational, elegant, and concise. Let the user reach their own conclusions.
${memoryContextStr}`;

    // Construct the contents list for @google/genai format
    // Contents can be structured as parts or message history
    const contents: any[] = [];

    // Add entry grounding
    contents.push({
      role: "user",
      parts: [{ text: `Here is the journal entry I wrote that we are talking about:\n"""\n${entryContent}\n"""` }]
    });

    contents.push({
      role: "model",
      parts: [{ text: "Thank you for sharing this entry with me. I have read it carefully. I'm here as a sounding board, a quiet mirror, to help you make sense of these thoughts. What aspect of this writing would you like to explore or unpack?" }]
    });

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
