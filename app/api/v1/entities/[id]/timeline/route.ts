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
    const entity = await store.getEntity(id);

    if (!entity) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    const episodes = await store.getEpisodesForEntity(id);

    // Sort chronologically by startTime or createdAt
    episodes.sort((a, b) => {
      const timeA = new Date(a.startTime || a.createdAt).getTime();
      const timeB = new Date(b.startTime || b.createdAt).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({
      entity: {
        id: entity.id,
        canonicalName: entity.canonicalName,
        type: entity.type
      },
      timeline: episodes
    });
  } catch (error: any) {
    console.error("Error getting entity timeline:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
