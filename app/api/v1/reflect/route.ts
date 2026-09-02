import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryRetriever } from "@/lib/memory-engine/retriever";
import { ReflectionEngine } from "@/lib/memory-engine/reflection";

export async function POST(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) || {};
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message string is required" }, { status: 400 });
    }

    const userId = decodedToken.uid;
    const retriever = new MemoryRetriever(userId);
    const context = await retriever.retrieveContext({ query: message });

    const reflectionEngine = new ReflectionEngine();
    const reflection = await reflectionEngine.reflect({
      message,
      context,
      history
    });

    return NextResponse.json({
      success: true,
      reflection,
      context: {
        pendingClarificationsCount: context.pendingClarifications.length,
        relevantEntitiesCount: context.relevantEntities.length
      }
    });
  } catch (error: any) {
    console.error("Reflection route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
