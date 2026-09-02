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
    const store = new MemoryStore(decodedToken.uid);
    const rel = await store.getRelationship(id);

    if (!rel) {
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    return NextResponse.json({ relationship: rel });
  } catch (error: any) {
    console.error("Error getting relationship:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
