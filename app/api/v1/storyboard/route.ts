import { NextRequest, NextResponse } from "next/server";
import { generateContentWithFallback } from "@/lib/gemini";
import { buildPersonPromptDescriptor } from "@/lib/memory-engine/person-graph";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dateStr, entries, people, artStyle = "sketch" } = body;

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: "No entries provided for storyboard synthesis" }, { status: 400 });
    }

    // Resolve persistent visual character prompt descriptors for all people tagged
    const personDescriptors = (people || []).map((name: string) => buildPersonPromptDescriptor(name)).join("; ");

    const systemPrompt = `You are Memoiary's AI Art Director. Your goal is to synthesize a single, unified daily hand-drawn narrative collage prompt for an entire day's entries (${dateStr}).
Art Style Requested: ${artStyle.toUpperCase()} (e.g. Pencil & Graphite Sketch, Studio Ghibli, Risograph).

Persistent Character Profiles to Maintain:
${personDescriptors || "None specified"}

Entries for the Day:
${JSON.stringify(entries)}

Instructions:
1. Synthesize 3 key sequential scenes from the user's day into a single artist journal page composition.
2. Ensure the facial features, hair, and clothing of tagged people match their persistent character descriptors.
3. Return a JSON object with:
   - "title": A poetic title for the day's collage (e.g., "A Day of Milestones and Sunset Reflections")
   - "artStyle": "${artStyle}"
   - "synthesizedPrompt": Detailed image generation prompt to generate this collage.
   - "scenes": Array of [{ "panelNumber": 1, "time": "11:00 AM", "title": "...", "summary": "...", "people": [...] }]`;

    const result = await generateContentWithFallback(systemPrompt, {
      temperature: 0.3,
      responseMimeType: "application/json"
    });

    const parsed = JSON.parse(result.text);

    return NextResponse.json({
      success: true,
      storyboard: parsed,
      generatedCollageUrl: artStyle === "sketch"
        ? "/collages/daily_collage_sketch.jpg"
        : artStyle === "risograph"
        ? "/collages/daily_collage_risograph.jpg"
        : "/collages/daily_collage_ghibli.jpg"
    });
  } catch (error: any) {
    console.error("Storyboard API error:", error);
    return NextResponse.json({ error: error.message || "Storyboard synthesis failed" }, { status: 500 });
  }
}
