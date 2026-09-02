import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryStore } from "@/lib/memory-engine/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Capture ID is required" }, { status: 400 });
    }

    const store = new MemoryStore(decodedToken.uid);
    const capture = await store.getCapture(id);

    if (!capture) {
      return NextResponse.json({ error: "Capture not found" }, { status: 404 });
    }

    return NextResponse.json({ capture });
  } catch (error: any) {
    console.error("Error getting capture details:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
