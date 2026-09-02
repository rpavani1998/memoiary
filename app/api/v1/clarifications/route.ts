import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryStore } from "@/lib/memory-engine/store";

export async function GET(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const store = new MemoryStore(decodedToken.uid);
    const clarifications = await store.getClarifications(status);

    return NextResponse.json({
      success: true,
      clarifications
    });
  } catch (error: any) {
    console.error("Fetch clarifications error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch clarifications" },
      { status: 500 }
    );
  }
}
