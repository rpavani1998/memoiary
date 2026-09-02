import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryStore } from "@/lib/memory-engine/store";

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

    // Check if it's an internal state
    const existingState = await store.getState(id);
    if (existingState) {
      await store.updateState(id, body);
      const updated = await store.getState(id);
      return NextResponse.json({ success: true, memory: updated, type: "state" });
    }

    // Check if it's an episode
    const existingEpisode = await store.getEpisode(id);
    if (existingEpisode) {
      await store.updateEpisode(id, body);
      const updated = await store.getEpisode(id);
      return NextResponse.json({ success: true, memory: updated, type: "episode" });
    }

    // Check if it's a learning
    const learnings = await store.listLearnings();
    const existingLearning = learnings.find((l) => l.id === id);
    if (existingLearning) {
      await store.updateLearning(id, body);
      return NextResponse.json({ success: true, type: "learning" });
    }

    return NextResponse.json({ error: "Memory item not found" }, { status: 404 });
  } catch (error: any) {
    console.error("Error updating memory:", error);
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

    await store.deleteState(id).catch(() => {});
    await store.deleteEpisode(id).catch(() => {});
    await store.deleteLearning(id).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting memory:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
