import { generateContentWithFallback, safeParseJson } from "../lib/gemini";
import fs from "fs";
import path from "path";

// Load .env manually if process.env.GEMINI_API_KEY is not already set
if (!process.env.GEMINI_API_KEY) {
  try {
    const envPath = path.resolve(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      envContent.split("\n").forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          }
          process.env[key] = value.trim();
        }
      });
    }
  } catch (err) {
    console.warn("Could not parse .env file:", err);
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("MEMOIARY MULTIMODAL PIPELINE & EVALUATION SUITE");
  console.log("=================================================\n");

  const testResults: any[] = [];

  // -------------------------------------------------------------
  // STAGE 1 & 2: TEXT CAPTURE (Dimensions & Entities Extraction)
  // -------------------------------------------------------------
  console.log(">>> TEST CASE 1: TEXT CAPTURE (Dimensions & Entities Extraction)");
  const textInput = "Felt a heavy cloud over me today at the office around 3:30 PM. Our main third-party integration API failed right before a client demo, pushing back our entire launch schedule by two weeks. I was sitting at my desk feeling overwhelmed and questioning my abilities. Right then, Priya randomly called me from Mumbai just to ask if I had eaten lunch. I ended up venting to her for 10 minutes, and she reminded me of how far we've come. It's crazy how a short, genuine call from a friend can pull you out of a spiral.";

  console.log("Input Text:", textInput);
  
  try {
    const textRes = await generateContentWithFallback(textInput, {
      systemInstruction: `You are Memoiary's Dimension Extractor. Analyze the capture and extract rich metadata dimensions.
Return ONLY valid JSON with keys:
- "summary": 1-2 sentence summary
- "mood": overall mood
- "tone": speaking/writing tone
- "emotions": array of { "label", "intensity", "valence" }
- "people": array of names
- "places": array of locations
- "topics": array of key topics
- "activities": array of actions performed
- "thoughts": inner thoughts or realizations
- "timeContext": when it happened`,
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const textDimensions = JSON.parse(textRes.text);
    console.log("\n[Extracted Dimensions Output]:");
    console.log(JSON.stringify(textDimensions, null, 2));

    testResults.push({
      testName: "Test 1: Text Capture Dimensions",
      status: "PASSED",
      output: textDimensions
    });
  } catch (err: any) {
    console.error("Test 1 Error:", err?.message || err);
    testResults.push({ testName: "Test 1: Text Capture Dimensions", status: "FAILED", error: err?.message });
  }

  // -------------------------------------------------------------
  // STAGE 1 & 2: AUDIO & VOICE EMOTION METADATA ANALYSIS
  // -------------------------------------------------------------
  console.log("\n-------------------------------------------------");
  console.log(">>> TEST CASE 2: AUDIO & VOICE EMOTION METADATA ANALYSIS");
  const audioTranscript = "It's 11:45 PM and I'm just sitting on my balcony trying to unwind. Today at work was brutal... [sighs deeply]... the sprint review devolved into endless debate over button padding, and by 7 PM my head was pounding. I put on my running shoes and went for a 45-minute late night walk through Jubilee Hills. The cool breeze helped clear my head.";
  
  try {
    const audioRes = await generateContentWithFallback(audioTranscript, {
      systemInstruction: `You are Memoiary's audio analysis engine. Analyze this audio transcript and extract:
1. TRANSCRIPTION: Spoken text.
2. SPEAKER_EMOTION: Primary voice emotion (vulnerable, exhausted, relieved, etc.).
3. TONE: Speaking tone.
4. SPEECH_PATTERNS: Sighs, pauses, pace shifts.
5. KEY_ENTITIES: People, places mentioned.
6. SUMMARY: 1-2 sentence summary.

Return ONLY valid JSON.`,
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const audioOutput = JSON.parse(audioRes.text);
    console.log("\n[Audio Analysis Output]:\n", JSON.stringify(audioOutput, null, 2));
    testResults.push({
      testName: "Test 2: Audio Voice Emotion Analysis",
      status: "PASSED",
      output: audioOutput
    });
  } catch (err: any) {
    console.error("Test 2 Error:", err?.message || err);
    testResults.push({ testName: "Test 2: Audio Voice Emotion Analysis", status: "FAILED", error: err?.message });
  }

  // -------------------------------------------------------------
  // STAGE 1 & 2: IMAGE & SCENE METADATA ANALYSIS
  // -------------------------------------------------------------
  console.log("\n-------------------------------------------------");
  console.log(">>> TEST CASE 3: IMAGE & SCENE METADATA ANALYSIS");
  try {
    const imageRes = await generateContentWithFallback("Image description: Rain pouring hard against cafe glass window at Blue Tokai, a hot oat milk latte in a ceramic mug, open physical journal on wooden table.", {
      systemInstruction: `You are Memoiary's image analysis engine. Given a photo description, extract:
1. SCENE_DESCRIPTION: Visual scene description.
2. LOCATION_HINTS: Inferred place/location.
3. MOOD: Ambient visual mood.
4. OBJECTS: Visible key items.
5. TIME_HINTS: Time of day/weather hints.
6. SUMMARY: 1-2 sentence summary.

Return ONLY valid JSON.`,
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const imageOutput = JSON.parse(imageRes.text);
    console.log("\n[Image Metadata Output]:\n", JSON.stringify(imageOutput, null, 2));
    testResults.push({
      testName: "Test 3: Image Scene Analysis",
      status: "PASSED",
      output: imageOutput
    });
  } catch (err: any) {
    console.error("Test 3 Error:", err?.message || err);
    testResults.push({ testName: "Test 3: Image Scene Analysis", status: "FAILED", error: err?.message });
  }

  // -------------------------------------------------------------
  // STAGE 1 & 2: VIDEO ANALYSIS METADATA (VISUAL + AUDIO SYNTHESIS)
  // -------------------------------------------------------------
  console.log("\n-------------------------------------------------");
  console.log(">>> TEST CASE 4: VIDEO ANALYSIS METADATA (VISUAL + AUDIO)");
  try {
    const videoRes = await generateContentWithFallback("Video clip: Night campfire in Ananthagiri Hills, acoustic guitar strumming, Rohan and Sanya laughing and singing old songs under pitch-black starry sky.", {
      systemInstruction: `You are Memoiary's video analysis engine. Analyze this video and extract:
1. TRANSCRIPTION: Spoken lyrics/audio transcript.
2. SCENE_DESCRIPTION: Visual scene description.
3. PEOPLE: People visible or heard.
4. LOCATION_HINTS: Location cues.
5. MOOD: Emotional mood.
6. AUDIO_ANALYSIS: Music, instruments, ambient sounds.
7. SUMMARY: 1-2 sentence summary.

Return ONLY valid JSON.`,
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const videoOutput = JSON.parse(videoRes.text);
    console.log("\n[Video Metadata Output]:\n", JSON.stringify(videoOutput, null, 2));
    testResults.push({
      testName: "Test 4: Video Visual + Audio Synthesis",
      status: "PASSED",
      output: videoOutput
    });
  } catch (err: any) {
    console.error("Test 4 Error:", err?.message || err);
    testResults.push({ testName: "Test 4: Video Visual + Audio Synthesis", status: "FAILED", error: err?.message });
  }

  // -------------------------------------------------------------
  // STAGE 3: CONNECTIONS, PATTERNS & MEMORY GRAPH CATEGORIZATION
  // -------------------------------------------------------------
  console.log("\n-------------------------------------------------");
  console.log(">>> TEST CASE 5: CONNECTIONS & PATTERN GRAPH LINKING");
  try {
    const pastEntries = [
      { id: "e1", title: "Work Burnout & Night Walk", date: "7 days ago", summary: "Sprint review devolved into argument over padding, felt exhausted." },
      { id: "e2", title: "Rainy Tuesday Coffee", date: "6 days ago", summary: "Quiet morning oat milk latte at Blue Tokai." },
      { id: "e3", title: "API Failure Stress & Call from Priya", date: "3 days ago", summary: "Felt overwhelmed after client demo API failed, Priya called." }
    ];

    const newEntry = "Sitting at my desk feeling overwhelmed by sprint deadlines again. Thinking of taking another night walk through Jubilee Hills to clear my head.";

    const connRes = await generateContentWithFallback(`New Entry: ${newEntry}\nPast Entries: ${JSON.stringify(pastEntries)}`, {
      systemInstruction: `You are Memoiary's Pattern & Connection Engine. Analyze the new entry and connect it to relevant past entries. Identify repeating patterns (e.g. Monday sprint burnout, night walks as a reset strategy).
Return ONLY valid JSON with fields:
- "connectedEntries": array of { "id", "reason" }
- "userPatterns": array of observed behavior patterns
- "emotionalTriggers": observed triggers
- "copingStrategies": effective coping strategies observed`,
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const connOutput = JSON.parse(connRes.text);
    console.log("\n[Pattern & Connection Output]:\n", JSON.stringify(connOutput, null, 2));
    testResults.push({
      testName: "Test 5: Pattern & Graph Connection",
      status: "PASSED",
      output: connOutput
    });
  } catch (err: any) {
    console.error("Test 5 Error:", err?.message || err);
    testResults.push({ testName: "Test 5: Pattern & Graph Connection", status: "FAILED", error: err?.message });
  }

  // -------------------------------------------------------------
  // STAGE 4: EMPATHETIC CONVERSATIONAL PARTNER (SOCRATIC CHAT)
  // -------------------------------------------------------------
  console.log("\n-------------------------------------------------");
  console.log(">>> TEST CASE 6: EMPATHETIC SOCRATIC CONVERSATIONAL CHAT");
  try {
    const chatInput = "Why do I always feel so burned out on Mondays after sprint reviews?";

    const chatRes = await generateContentWithFallback(chatInput, {
      systemInstruction: `You are Memoiary — an objective mirror grounded strictly in what the user has journaled. You are NOT an AI companion, AI persona, therapist, coach, or life advisor. You have no separate personality or opinions outside their recorded entries.

CRITICAL RULES:
- Absolutely NEVER use preachy or commanding language ("You should...", "You need to...").
- Do NOT give generic motivational quotes ("stay positive!", "you've got this!").
- Reflect what they said, point out patterns across past entries, and ask gentle, curious questions so the user can explore their own feelings.
- Maintain a tone that is calm, grounded, objective, deeply personal, and non-judgmental.`,
      temperature: 0.3
    });

    console.log("\n[Reflective Journal Mirror Response]:\n", chatRes.text);
    testResults.push({
      testName: "Test 6: Reflective Journal Mirror Chat",
      status: !chatRes.text.includes("You should") && !chatRes.text.includes("You need to") ? "PASSED" : "FAILED",
      response: chatRes.text
    });
  } catch (err: any) {
    console.error("Test 6 Error:", err?.message || err);
    testResults.push({ testName: "Test 6: Reflective Journal Mirror Chat", status: "FAILED", error: err?.message });
  }

  console.log("\n=================================================");
  console.log("FINAL TEST SUMMARY RESULTS:");
  console.log("=================================================");
  testResults.forEach((t) => {
    console.log(`[${t.status}] ${t.testName}`);
  });
}

runTests().catch(console.error);
