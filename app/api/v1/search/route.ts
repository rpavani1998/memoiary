import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryStore } from "@/lib/memory-engine/store";
import { generateContentWithFallback } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) || {};
    const { query } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const store = new MemoryStore(decodedToken.uid);
    const captures = await store.getCaptures(50);

    if (captures.length === 0) {
      return NextResponse.json({ results: [], message: "No captures yet. Start capturing to search your memories." });
    }

    // Build a digest of captures for Gemini to rank
    const capturesDigest = captures.map((c, i) => ({
      index: i,
      content: c.content.substring(0, 200),
      source: c.source,
      date: c.createdAt,
      mood: c.dimensions?.mood,
      people: c.dimensions?.people,
      places: c.dimensions?.places,
      topics: c.dimensions?.topics
    }));

    const systemInstruction = `You are Memoiary's search engine. Given a user query and their captured memories, find the most relevant matches.

Return a JSON array of objects with:
- index: the original capture index (number)
- relevance: a score from 0-1 (number)
- reason: brief explanation of why this matches (string)

Rank by relevance. Only include captures with relevance > 0.3. Return at most 5 results.`;

    const schema = {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              index: { type: "number" },
              relevance: { type: "number" },
              reason: { type: "string" }
            },
            required: ["index", "relevance", "reason"]
          }
        }
      },
      required: ["results"]
    };

    const prompt = `User search query: "${query}"

Here are the user's captured memories:
${JSON.stringify(capturesDigest, null, 2)}

Find the most relevant memories matching this query. Return the ranked results as JSON.`;

    const result = await generateContentWithFallback(prompt, {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.1
    });

    let rankedResults: Array<{ index: number; relevance: number; reason: string }> = [];
    try {
      const parsed = JSON.parse(result.text || '{"results":[]}');
      rankedResults = parsed.results || [];
    } catch {
      // Fallback: simple text matching
      rankedResults = captures
        .map((c, i) => ({
          index: i,
          relevance: c.content.toLowerCase().includes(query.toLowerCase()) ? 0.8 : 0.1,
          reason: "Text match"
        }))
        .filter((r) => r.relevance > 0.3)
        .slice(0, 5);
    }

    const results = rankedResults.map((r) => ({
      capture: captures[r.index],
      relevance: r.relevance,
      reason: r.reason
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error?.message || "Search failed" }, { status: 500 });
  }
}
