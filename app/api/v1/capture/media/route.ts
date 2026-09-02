import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MediaAsset } from "@/lib/memory-engine/types";

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
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const {
      captureSessionId = `cap_${Date.now()}`,
      type = "IMAGE",
      storageUri,
      mimeType,
      transcription,
      ocrText
    } = body;

    const mediaAsset: MediaAsset = {
      id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      captureSessionId,
      type,
      storageUri,
      mimeType,
      transcription,
      ocrText,
      processingStatus: "processed",
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      mediaAsset
    });
  } catch (error: any) {
    console.error("Error in capture/media:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
