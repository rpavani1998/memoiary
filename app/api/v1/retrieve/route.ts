import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryRetriever } from "@/lib/memory-engine/retriever";

export async function POST(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { query = "", targetEntityId, timeWindowDays = 90, maxEpisodes = 5, maxEntities = 4 } = body;

    const retriever = new MemoryRetriever(decodedToken.uid);
    const context = await retriever.retrieveContext({
      query,
      targetEntityId,
      timeWindowDays,
      maxEpisodes,
      maxEntities
    });

    return NextResponse.json({
      success: true,
      context
    });
  } catch (error: any) {
    console.error("Error in /api/v1/retrieve:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
