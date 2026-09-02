import { generateContentWithFallback } from "@/lib/gemini";
import { RetrievedContext } from "./retriever";

interface ReflectionOptions {
  message: string;
  context: RetrievedContext;
  history?: Array<{ role: "user" | "model"; text: string }>;
  tone?: "objective" | "warm" | "socratic";
}

export class ReflectionEngine {
  async reflect(options: ReflectionOptions): Promise<string> {
    const { message, context, history = [] } = options;

    const systemPrompt = `You are Memoiary — the quiet, objective, compassionate witness to the user's life story and autobiographical memory.

CARDINAL GUIDING PRINCIPLES:
1. "The system remembers more than it says": Never dump database records or lecture the user.
2. Act like a careful friend who remembers, NOT a fact checker who corrects.
3. If there is an active question or pending clarification (e.g., distinguishing an entity mixup or disambiguating two people), gently ask or confirm in a natural conversational voice.
4. Avoid diagnosing emotions, prescribing psychological fixes, or giving unsolicited lifestyle advice.
5. If the user confirms a previous question (e.g., "Yes, exactly" or "No, I meant Friends"), gracefully receive it and maintain natural dialogue.

SILENT MEMORY CONTEXT AVAILABLE TO YOU:
- Entities Known: ${JSON.stringify(context.relevantEntities.map((e) => ({ name: e.name, category: e.category })))}
- Recent Episodes: ${JSON.stringify(context.recentEpisodes.map((ep) => ({ title: ep.title, date: ep.date, summary: ep.summary })))}
- Pending Clarifications: ${JSON.stringify(context.pendingClarifications.map((c) => ({ question: c.question, type: c.type, context: c.context })))}

Respond concisely, with spaciousness, emotional poise, and thoughtful reflection.`;

    const contents: any[] = [];
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role,
        parts: [{ text: h.text }]
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    try {
      const response = await generateContentWithFallback(contents, {
        systemInstruction: systemPrompt,
        temperature: 0.3
      });

      return response.text.trim();
    } catch (error) {
      console.error("Reflection error:", error);
      return "I am here with you, listening closely to what you shared.";
    }
  }
}
