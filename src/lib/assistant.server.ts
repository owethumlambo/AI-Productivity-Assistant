import { streamText, type ModelMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

export const TaskInput = z.object({
  taskId: z.enum(["email", "notes", "planner", "research", "summarize"]),
  content: z.string().min(1),
  tone: z.string().optional(),
  extra: z.string().optional(),
});

export const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

const PROMPTS: Record<string, string> = {
  email:
    "You are a workplace communications assistant. Turn the user's intent into a ready-to-send email. Return markdown with: **Subject:** line, then the email body (max 180 words), then a sign-off placeholder. No commentary.",
  notes:
    "You summarize meeting notes. Return markdown with exactly these sections as H3 headings: Summary, Key Decisions, Action Items (bullet per item with owner and due date, use 'Unassigned'/'No date' when missing), Deadlines, Open Questions. No commentary.",
  planner:
    "You are a scheduling assistant. Build a realistic schedule from the user's tasks. Return markdown with: a prioritized task table (Task | Priority P1-P3 | Estimate | Rationale), then a time-blocked schedule with concrete time slots, then a short 'If time runs out' section naming what to drop.",
  research:
    "You are a research analyst. From the supplied article, notes, or topic, return markdown with H3 sections: Summary, Key Insights (bulleted), Actionable Recommendations (bulleted, each starting with a verb), and Caveats. Be specific and avoid filler.",
  summarize:
    "You are an executive assistant. Return markdown: a one-line TL;DR, 3-5 key bullets, then a Risks section.",
};

const SYSTEM_CHAT =
  "You are the AI Workplace Productivity Assistant: a pragmatic colleague who helps professionals with email, meetings, planning, research and process questions. Be concise, use markdown, prefer concrete steps over generalities, and say when you're unsure. Never invent facts, names, or numbers.";

function friendlyError(error: unknown): never {
  const status =
    (error as { statusCode?: number })?.statusCode ?? (error as { status?: number })?.status;
  if (status === 429) throw new Error("Too many requests right now — try again in a moment.");
  if (status === 402)
    throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
  if (status === 403) throw new Error("AI access is blocked for this workspace.");
  throw new Error(error instanceof Error ? error.message : "The assistant failed to respond.");
}

const MODEL = "google/gemini-2.5-flash";

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this app.");
  return createLovableAiGatewayProvider(key);
}

export async function runAssistantTask(data: z.infer<typeof TaskInput>) {
  const system =
    PROMPTS[data.taskId] +
    (data.tone ? ` Write in a ${data.tone.toLowerCase()} tone.` : "") +
    (data.extra ? ` Additional context/constraints: ${data.extra}` : "") +
    " Never invent facts that are not in the input.";

  try {
    const result = streamText({
      model: gateway()(MODEL),
      system,
      prompt: data.content.slice(0, 20000),
    });
    return { text: await result.text };
  } catch (error) {
    friendlyError(error);
  }
}

export async function runChat(data: z.infer<typeof ChatInput>) {
  try {
    const result = streamText({
      model: gateway()(MODEL),
      system: SYSTEM_CHAT,
      messages: data.messages.slice(-24) as ModelMessage[],
    });
    return { text: await result.text };
  } catch (error) {
    friendlyError(error);
  }
}
