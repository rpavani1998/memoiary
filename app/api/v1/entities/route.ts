import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryStore } from "@/lib/memory-engine/store";
import { Entity } from "@/lib/memory-engine/types";

export async function GET(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const query = searchParams.get("q") || undefined;

    const store = new MemoryStore(decodedToken.uid);
    let entities = await store.listEntities(type);

    if (query) {
      const qLower = query.toLowerCase();
      entities = entities.filter((e) =>
        (e.canonicalName && e.canonicalName.toLowerCase().includes(qLower)) ||
        (e.name && e.name.toLowerCase().includes(qLower)) ||
        (e.aliases && e.aliases.some((a) => a.toLowerCase().includes(qLower))) ||
        (e.description && e.description.toLowerCase().includes(qLower))
      );
    }

    return NextResponse.json({ entities });
  } catch (error: any) {
    console.error("Error listing entities:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { canonicalName, type = "PERSON", aliases = [], description, occupation } = body;
    if (!canonicalName || typeof canonicalName !== "string" || !canonicalName.trim()) {
      return NextResponse.json({ error: "Canonical name is required" }, { status: 400 });
    }

    const entityId = `ent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const entity: Entity = {
      id: entityId,
      userId: decodedToken.uid,
      name: canonicalName,
      type,
      canonicalName,
      aliases,
      description,
      occupation,
      importanceScore: 0.5,
      confidenceScore: 1.0,
      status: "active",
      createdAt: now,
      updatedAt: now,
      lastMentionedAt: now
    };

    const store = new MemoryStore(decodedToken.uid);
    await store.saveEntity(entity);

    return NextResponse.json({ success: true, entity });
  } catch (error: any) {
    console.error("Error creating entity:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
