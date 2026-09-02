import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryStore } from "@/lib/memory-engine/store";
import { MemoryReconciler } from "@/lib/memory-engine/reconciliation";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await req.json().catch(() => ({}))) || {};
    const { action, customCorrection } = body;

    if (!action || !["confirm", "reject", "correct", "dismiss"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'confirm', 'reject', 'correct', or 'dismiss'" },
        { status: 400 }
      );
    }

    const userId = decodedToken.uid;
    const store = new MemoryStore(userId);
    const reconciler = new MemoryReconciler(userId, store);

    const result = await reconciler.resolveClarification(id, action, customCorrection);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error("Clarification response error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
