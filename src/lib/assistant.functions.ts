import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runAssistantTask, TaskInput } from "./assistant.server";

export const runTask = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TaskInput.parse(input))
  .handler(async ({ data }) => runAssistantTask(data));

export type TaskId = z.infer<typeof TaskInput>["taskId"];
