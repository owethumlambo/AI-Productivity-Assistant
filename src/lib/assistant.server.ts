import { streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

export const TaskInput = z.object({
  taskId: z.enum(["summarize", "email", "actions", "rewrite", "agenda"]),
  content: z.string().min(1),
  tone: z.string().optional(),
});

const PROMPTS: Record<string, string> = {
  summarize:
    "You are an executive assistant. Summarize the input into a tight brief: a one-sentence TL;DR, then 3-5 bullet points of key facts, then any risks. Use markdown-free plain text with '-' bullets.",
  email:
    "You are a professional communications assistant. Turn the input into a ready-to-send workplace email: subject line, greeting, concise body (max 150 words), and sign-off placeholder. Plain text only.",
  actions:
    "You extract action items from meeting notes. Output a numbered list. Each line: task, owner (or 'Unassigned'), and due date (or 'No date'). Then a short 'Open questions' section. Plain text only.",
  rewrite:
    "You rewrite workplace messages. Keep the meaning, improve clarity and flow, remove filler. Return only the rewritten message in plain text.",
  agenda:
    "You are a meeting planner. From the input, produce a focused meeting agenda: objective, timeboxed agenda items with minutes, required attendees, and pre-reads. Plain text only.",
};

export async function runAssistantTask(data: z.infer<typeof TaskInput>) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this app.");

  const gateway = createLovableAiGatewayProvider(key);
  const system =
    PROMPTS[data.taskId] +
    (data.tone ? ` Write in a ${data.tone} tone.` : "") +
    " Never invent facts that are not in the input.";

  try {
    const result = streamText({
      model: gateway("google/gemini-2.5-flash"),
      system,
      prompt: data.content.slice(0, 20000),
    });
    return { text: await result.text };
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode ??
      (error as { status?: number })?.status;
    if (status === 429) throw new Error("Too many requests right now — try again in a moment.");
    if (status === 402) throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
    if (status === 403) throw new Error("AI access is blocked for this workspace.");
    throw new Error(error instanceof Error ? error.message : "The assistant failed to respond.");
  }
}
