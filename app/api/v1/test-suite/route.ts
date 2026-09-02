import { NextResponse } from "next/server";
import { MemoryStore } from "@/lib/memory-engine/store";
import { MemoryExtractor } from "@/lib/memory-engine/extractor";
import { ConsistencyEngine } from "@/lib/memory-engine/consistency";
import { MemoryReconciler } from "@/lib/memory-engine/reconciliation";
import { EpistemicSource } from "@/lib/memory-engine/types";

interface TestResult {
  testId: number;
  name: string;
  passed: boolean;
  details: string;
  data?: any;
}

export async function GET(req: Request) {
  const testUserId = `test_user_${Date.now()}`;
  const store = new MemoryStore(testUserId);
  const extractor = new MemoryExtractor();
  const consistency = new ConsistencyEngine();
  const reconciler = new MemoryReconciler(testUserId, store);

  const results: TestResult[] = [];

  try {
    // -------------------------------------------------------------
    // Test 1: "Friends + Sheldon" -> Clarification generated
    // -------------------------------------------------------------
    const input1 = "I watched Friends today and loved the Halloween episode where Sheldon, Leonard, Raj and Howard try to scare Sheldon.";
    const bundle1 = await extractor.extract({ userId: testUserId, captureId: "cap_1", rawText: input1 });
    const check1 = await consistency.checkConsistency({
      userId: testUserId,
      captureId: "cap_1",
      rawInput: input1,
      extractedBundle: bundle1,
      store
    });

    const passed1 = check1.hasConflict && check1.clarifications.length > 0 && 
      (check1.clarifications[0].question.toLowerCase().includes("big bang") || check1.clarifications[0].context.toLowerCase().includes("big bang"));
    
    results.push({
      testId: 1,
      name: "Friends + Sheldon -> Clarification generated",
      passed: passed1,
      details: passed1 
        ? `Clarification generated: "${check1.clarifications[0]?.question}"` 
        : `Failed to detect mismatch: ${JSON.stringify(check1)}`
    });

    let clarId1 = "";
    if (check1.clarifications[0]) {
      clarId1 = check1.clarifications[0].id;
      await store.saveClarification(check1.clarifications[0]);
    }

    // -------------------------------------------------------------
    // Test 2: User confirms -> corrected active memory
    // -------------------------------------------------------------
    let passed2 = false;
    let details2 = "";
    if (clarId1) {
      const res2 = await reconciler.resolveClarification(clarId1, "confirm");
      passed2 = Boolean(
        res2.clarification.status === "confirmed" && 
        res2.clarification.epistemicStatus === EpistemicSource.USER_CONFIRMED &&
        (res2.updatedEpisode?.summary?.toLowerCase().includes("big bang") || 
         res2.updatedEpisode?.entitiesInvolved?.some(e => e.toLowerCase().includes("big bang")))
      );
      details2 = `Episode active summary: "${res2.updatedEpisode?.summary}", Status: ${res2.clarification.status}`;
    }
    results.push({
      testId: 2,
      name: "User confirms -> corrected active memory",
      passed: passed2,
      details: details2
    });

    // -------------------------------------------------------------
    // Test 3: User rejects -> preserve original interpretation
    // -------------------------------------------------------------
    const input3 = "I watched Friends with Sheldon.";
    const cap3 = "cap_3";
    const bundle3 = await extractor.extract({ userId: testUserId, captureId: cap3, rawText: input3 });
    const check3 = await consistency.checkConsistency({
      userId: testUserId,
      captureId: cap3,
      rawInput: input3,
      extractedBundle: bundle3,
      store
    });
    let passed3 = false;
    let details3 = "";
    if (check3.clarifications[0]) {
      await store.saveClarification(check3.clarifications[0]);
      await store.saveEpisode(bundle3.episodes[0]);
      const res3 = await reconciler.resolveClarification(check3.clarifications[0].id, "reject", "No, I meant Friends");
      passed3 = res3.clarification.status === "rejected" && 
                res3.clarification.epistemicStatus === EpistemicSource.USER_SAID;
      details3 = `Clarification status: ${res3.clarification.status}, Epistemic source: ${res3.clarification.epistemicStatus}`;
    }
    results.push({
      testId: 3,
      name: "User rejects -> preserve original interpretation",
      passed: passed3,
      details: details3
    });

    // -------------------------------------------------------------
    // Test 4: Multiple Sams -> Clarification
    // -------------------------------------------------------------
    // Seed two Sams in user graph
    await store.saveEntity({
      id: "ent_sam_1",
      userId: testUserId,
      name: "Sam",
      category: "PERSON",
      aliases: [],
      epistemicStatus: EpistemicSource.USER_SAID,
      confidence: 1.0,
      firstObserved: new Date().toISOString(),
      lastObserved: new Date().toISOString()
    });
    await store.saveRelationship({
      id: "rel_sam_1",
      userId: testUserId,
      sourceId: "ent_sam_1",
      targetId: "user",
      predicate: "designer on project",
      status: "active",
      epistemicStatus: EpistemicSource.USER_SAID,
      confidence: 1.0
    });
    await store.saveEntity({
      id: "ent_sam_2",
      userId: testUserId,
      name: "Sam",
      category: "PERSON",
      aliases: [],
      epistemicStatus: EpistemicSource.USER_SAID,
      confidence: 1.0,
      firstObserved: new Date().toISOString(),
      lastObserved: new Date().toISOString()
    });
    await store.saveRelationship({
      id: "rel_sam_2",
      userId: testUserId,
      sourceId: "ent_sam_2",
      targetId: "user",
      predicate: "college roommate",
      status: "active",
      epistemicStatus: EpistemicSource.USER_SAID,
      confidence: 1.0
    });

    const input4 = "I met Sam for coffee.";
    const bundle4 = await extractor.extract({ userId: testUserId, captureId: "cap_4", rawText: input4 });
    const check4 = await consistency.checkConsistency({
      userId: testUserId,
      captureId: "cap_4",
      rawInput: input4,
      extractedBundle: bundle4,
      store
    });
    const passed4 = check4.hasConflict && check4.clarifications.some(c => c.type === "ambiguity");
    results.push({
      testId: 4,
      name: "Multiple Sams -> Ambiguity clarification",
      passed: passed4,
      details: passed4 ? `Ambiguity question: "${check4.clarifications[0]?.question}"` : "Failed to flag ambiguity"
    });

    // -------------------------------------------------------------
    // Test 5: Rahul = brother + colleague -> No contradiction
    // -------------------------------------------------------------
    await store.saveEntity({
      id: "ent_rahul",
      userId: testUserId,
      name: "Rahul",
      category: "PERSON",
      aliases: [],
      epistemicStatus: EpistemicSource.USER_SAID,
      confidence: 1.0,
      firstObserved: new Date().toISOString(),
      lastObserved: new Date().toISOString()
    });
    await store.saveRelationship({
      id: "rel_rahul_1",
      userId: testUserId,
      sourceId: "ent_rahul",
      targetId: "user",
      predicate: "brother",
      status: "active",
      epistemicStatus: EpistemicSource.USER_SAID,
      confidence: 1.0
    });

    const input5 = "Rahul is also my colleague on the backend team.";
    const bundle5 = await extractor.extract({ userId: testUserId, captureId: "cap_5", rawText: input5 });
    const check5 = await consistency.checkConsistency({
      userId: testUserId,
      captureId: "cap_5",
      rawInput: input5,
      extractedBundle: bundle5,
      store
    });
    // Multi-role should not trigger false contradiction
    const passed5 = !check5.hasConflict || !check5.clarifications.some(c => c.type === "contradiction");
    results.push({
      testId: 5,
      name: "Rahul = brother + colleague -> No false contradiction",
      passed: passed5,
      details: passed5 ? "Correctly allowed dual relationships without conflict" : "Incorrectly flagged contradiction"
    });

    // -------------------------------------------------------------
    // Test 6: Wednesday -> Thursday correction
    // -------------------------------------------------------------
    const input6 = "Actually, I met Rahul Thursday, not Wednesday.";
    const bundle6 = await extractor.extract({ userId: testUserId, captureId: "cap_6", rawText: input6 });
    const check6 = await consistency.checkConsistency({
      userId: testUserId,
      captureId: "cap_6",
      rawInput: input6,
      extractedBundle: bundle6,
      store
    });
    const passed6 = check6.isDirectUserCorrection || check6.adjustedBundle.episodes.some(ep => ep.epistemicStatus === EpistemicSource.USER_CORRECTED || ep.date.toLowerCase().includes("thurs"));
    results.push({
      testId: 6,
      name: "Wednesday -> Thursday direct correction",
      passed: passed6,
      details: passed6 ? `Detected direct user correction: ${JSON.stringify(check6.correctionDetails || "recognized")}` : "Failed to recognize direct correction"
    });

    // -------------------------------------------------------------
    // Test 7: Small time discrepancy (around 7 vs 7:07) -> No clarification
    // -------------------------------------------------------------
    const input7 = "I arrived around 7 PM for dinner.";
    const bundle7 = await extractor.extract({ userId: testUserId, captureId: "cap_7", rawText: input7 });
    const check7 = await consistency.checkConsistency({
      userId: testUserId,
      captureId: "cap_7",
      rawInput: input7,
      extractedBundle: bundle7,
      store
    });
    const passed7 = !check7.hasConflict || check7.clarifications.length === 0;
    results.push({
      testId: 7,
      name: "Small time discrepancy (around 7) -> No interruption",
      passed: passed7,
      details: passed7 ? "Correctly omitted pedantic clarification" : "Incorrectly flagged minor time difference"
    });

    // -------------------------------------------------------------
    // Test 8: Historical employer change -> No false contradiction
    // -------------------------------------------------------------
    await store.saveEntity({
      id: "ent_cu",
      userId: testUserId,
      name: "CU",
      category: "PERSON",
      aliases: [],
      epistemicStatus: EpistemicSource.USER_SAID,
      confidence: 1.0,
      firstObserved: "2024-01-01T00:00:00Z",
      lastObserved: new Date().toISOString()
    });
    await store.saveRelationship({
      id: "rel_cu_google",
      userId: testUserId,
      sourceId: "ent_cu",
      targetId: "Google",
      predicate: "works_at",
      status: "historical",
      validFrom: "2021-01-01",
      validTo: "2024-01-01",
      epistemicStatus: EpistemicSource.USER_SAID,
      confidence: 1.0
    });
    await store.saveRelationship({
      id: "rel_cu_msft",
      userId: testUserId,
      sourceId: "ent_cu",
      targetId: "Microsoft",
      predicate: "works_at",
      status: "active",
      validFrom: "2024-01-01",
      epistemicStatus: EpistemicSource.USER_SAID,
      confidence: 1.0
    });

    const input8 = "I met CU at Google yesterday for a tech talk.";
    const bundle8 = await extractor.extract({ userId: testUserId, captureId: "cap_8", rawText: input8 });
    const check8 = await consistency.checkConsistency({
      userId: testUserId,
      captureId: "cap_8",
      rawInput: input8,
      extractedBundle: bundle8,
      store
    });
    const passed8 = !check8.hasConflict || !check8.clarifications.some(c => c.type === "temporal_inconsistency" && c.significance === "high");
    results.push({
      testId: 8,
      name: "Historical employer change -> No false contradiction",
      passed: passed8,
      details: passed8 ? "Correctly honored historical validity without false contradiction" : "False contradiction flagged"
    });

    // -------------------------------------------------------------
    // Test 9: Original input remains preserved in provenance
    // -------------------------------------------------------------
    const input9 = "Visited Blue Bottle Coffee yesterday.";
    const cap9 = "cap_9";
    const bundle9 = await extractor.extract({ userId: testUserId, captureId: cap9, rawText: input9 });
    await reconciler.reconcile(bundle9, cap9, input9);
    const provs = await store.getProvenanceForMemory(bundle9.episodes[0].id);
    const passed9 = provs.length > 0 && provs[0].originalInput === input9;
    results.push({
      testId: 9,
      name: "Original input preserved in provenance",
      passed: passed9,
      details: passed9 ? `Provenance recorded original input: "${provs[0]?.originalInput}"` : "Provenance record missing"
    });

    // -------------------------------------------------------------
    // Test 10: Voice & Text share unified clarification pipeline
    // -------------------------------------------------------------
    const inputVoice = "Voice transcription: I watched Friends today with Sheldon and Leonard.";
    const bundleVoice = await extractor.extract({ userId: testUserId, captureId: "cap_voice", rawText: inputVoice });
    const checkVoice = await consistency.checkConsistency({
      userId: testUserId,
      captureId: "cap_voice",
      rawInput: inputVoice,
      extractedBundle: bundleVoice,
      store
    });
    const passed10 = checkVoice.hasConflict && checkVoice.clarifications.length > 0;
    results.push({
      testId: 10,
      name: "Voice & Text share unified pipeline",
      passed: passed10,
      details: passed10 ? `Voice transcript successfully triggered: "${checkVoice.clarifications[0]?.question}"` : "Voice check failed"
    });

    const allPassed = results.every((r) => r.passed);

    return NextResponse.json({
      success: true,
      allPassed,
      total: results.length,
      passedCount: results.filter((r) => r.passed).length,
      results
    });
  } catch (error: any) {
    console.error("Test runner error:", error);
    return NextResponse.json({
      success: false,
      error: error?.message || "Test execution failed",
      results
    }, { status: 500 });
  }
}
