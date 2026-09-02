import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/firebase-admin";
import { MemoryMaintenanceService } from "@/lib/memory-engine/maintenance";

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
      // Default body
    }

    const { action = "all" } = body;
    const maintenance = new MemoryMaintenanceService(decodedToken.uid);

    let discoveredPatterns: any[] = [];
    let duplicateEntities: any[] = [];

    if (action === "all" || action === "patterns") {
      discoveredPatterns = await maintenance.runPatternDetection();
    }

    if (action === "all" || action === "duplicates") {
      duplicateEntities = await maintenance.findDuplicateEntities();
    }

    return NextResponse.json({
      success: true,
      maintenanceResult: {
        discoveredPatternsCount: discoveredPatterns.length,
        patterns: discoveredPatterns,
        duplicateEntities
      }
    });

  } catch (error: any) {
    console.error("Error in /api/v1/maintenance:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
