import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { CaptureSession } from "@/lib/memory-engine/types";

export async function POST(req: Request) {
  try {
    const decodedToken = await verifyUserToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) || {};
    let { content, source = "text", mediaUrl, timezone = "UTC", mediaContext, dateOverride, customTitle, title } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      if (mediaUrl || mediaContext) {
        content = mediaContext || `Recorded ${source === "video" ? "Video" : source === "voice" ? "Voice" : "Photo"} Memory`;
      } else {
        return NextResponse.json({ error: "Capture content is required" }, { status: 400 });
      }
    }

    const userId = decodedToken.uid;
    const captureId = `cap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const db = getFirestore();
    const captureRef = db.collection("users").doc(userId).collection("captures").doc(captureId);

    const createdAtIso = dateOverride || new Date().toISOString();
    const entryTitle = customTitle || title || undefined;

    const captureSession: Record<string, any> = {
      id: captureId,
      userId,
      content: content.trim(),
      source,
      timezone,
      createdAt: createdAtIso,
      status: "received"
    };

    if (mediaUrl) captureSession.mediaUrl = mediaUrl;
    if (entryTitle) captureSession.title = entryTitle;

    // Save immediately with admin SDK
    await captureRef.set(captureSession);

    return NextResponse.json({
      success: true,
      status: "saved",
      captureId,
      capture: captureSession
    });
  } catch (error: any) {
    console.error("Capture API error:", error?.message || error);
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

    const db = getFirestore();
    const snap = await db.collection("users").doc(decodedToken.uid).collection("captures")
      .orderBy("createdAt", "desc").limit(50).get();
    const captures = snap.docs.map((d) => d.data() as CaptureSession);
    return NextResponse.json({ captures });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to list captures" }, { status: 500 });
  }
}
