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

    const relationships = await store.getRelationshipsForEntity(id);
    const episodes = await store.getEpisodesForEntity(id);

    return NextResponse.json({
      entity,
      relationships,
      recentEpisodes: episodes.slice(0, 10)
    });
  } catch (error: any) {
    console.error("Error getting entity:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const store = new MemoryStore(decodedToken.uid);
    const existing = await store.getEntity(id);
    if (!existing) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    await store.updateEntity(id, body);
    const updated = await store.getEntity(id);

    return NextResponse.json({ success: true, entity: updated });
  } catch (error: any) {
    console.error("Error updating entity:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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
    await store.deleteEntity(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting entity:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
