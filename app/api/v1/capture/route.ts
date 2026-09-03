import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryStore } from "@/lib/memory-engine/store";
import { MemoryExtractor } from "@/lib/memory-engine/extractor";
import { ConsistencyEngine } from "@/lib/memory-engine/consistency";
import { MemoryReconciler } from "@/lib/memory-engine/reconciliation";
import { CaptureSession } from "@/lib/memory-engine/types";

export async function POST(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) || {};
    const { content, source = "text", mediaUrl, timezone = "UTC", mediaContext } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Capture content is required" }, { status: 400 });
    }

    const userId = decodedToken.uid;
    const captureId = `cap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const store = new MemoryStore(userId);

    const captureSession: CaptureSession = {
      id: captureId,
      userId,
      content: content.trim(),
      source,
      mediaUrl,
      timezone,
      createdAt: new Date().toISOString(),
      status: "received"
    };

    // Save immediately so the user gets instant feedback
    await store.saveCapture(captureSession);

    // Return right away — analysis happens in background
    const analyzeInBackground = async () => {
      try {
        const extractor = new MemoryExtractor();
        const [extractedBundle, dimensions] = await Promise.all([
          extractor.extract({ userId, captureId, rawText: content.trim(), source, timezone }),
          extractor.extractDimensions({ userId, captureId, rawText: content.trim(), source, timezone, mediaContext })
        ]);

        const consistencyEngine = new ConsistencyEngine();
        const consistencyResult = await consistencyEngine.checkConsistency({
          userId, captureId, rawInput: content.trim(), extractedBundle, store
        });

        const reconciler = new MemoryReconciler(userId, store);
        const finalBundle = consistencyResult.adjustedBundle || extractedBundle;
        const { reconciledEntities, reconciledEpisodes } = await reconciler.reconcile(finalBundle, captureId, content.trim());

        await store.saveCapture({
          ...captureSession,
          status: "reconciled",
          dimensions,
          episodes: reconciledEpisodes
        });
      } catch (err) {
        console.error("[capture] background analysis failed:", err);
        // Mark as saved but unanalyzed — still usable
        await store.saveCapture({ ...captureSession, status: "saved_unanalyzed" }).catch(() => {});
      }
    };

    // Fire and don't await — client gets response in <100ms
    analyzeInBackground();

    return NextResponse.json({
      success: true,
      status: "saved",
      captureId,
      capture: captureSession
    });
  } catch (error: any) {
    console.error("Capture pipeline error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = new MemoryStore(decodedToken.uid);
    const captures = await store.getCaptures(50);
    return NextResponse.json({ captures });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to list captures" }, { status: 500 });
  }
}
