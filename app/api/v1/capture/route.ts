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
    const { content, source = "text", mediaUrl, timezone = "UTC" } = body;

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
    await store.saveCapture(captureSession);

    // 1. Extract raw memories
    const extractor = new MemoryExtractor();
    const extractedBundle = await extractor.extract({
      userId,
      captureId,
      rawText: content.trim(),
      timezone
    });

    // 2. Consistency & Clarification Check
    const consistencyEngine = new ConsistencyEngine();
    const consistencyResult = await consistencyEngine.checkConsistency({
      userId,
      captureId,
      rawInput: content.trim(),
      extractedBundle,
      store
    });

    const reconciler = new MemoryReconciler(userId, store);

    if (consistencyResult.hasConflict && consistencyResult.clarifications.length > 0) {
      // Save pending clarifications
      for (const clar of consistencyResult.clarifications) {
        await store.saveClarification(clar);
      }

      await store.saveCapture({
        ...captureSession,
        status: "clarification_needed"
      });

      return NextResponse.json({
        success: true,
        status: "clarification_needed",
        captureId,
        clarifications: consistencyResult.clarifications,
        extractedBundle
      });
    }

    // Direct User Correction or Clean Path -> Reconcile & Persist
    const finalBundle = consistencyResult.adjustedBundle || extractedBundle;
    const { reconciledEntities, reconciledEpisodes } = await reconciler.reconcile(
      finalBundle,
      captureId,
      content.trim()
    );

    await store.saveCapture({
      ...captureSession,
      status: "reconciled"
    });

    return NextResponse.json({
      success: true,
      status: "reconciled",
      captureId,
      reconciledEntities,
      reconciledEpisodes,
      isDirectUserCorrection: consistencyResult.isDirectUserCorrection || false,
      correctionDetails: consistencyResult.correctionDetails || null
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
