import { createServerFn } from "@tanstack/react-start";
import { ChatInput, TaskInput, runAssistantTask, runChat } from "./assistant.server";

export const runTask = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TaskInput.parse(input))
  .handler(async ({ data }) => runAssistantTask(data));

export const chat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => runChat(data));
