import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TaskWorkspace } from "@/components/TaskWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Scheduler — Workplace AI" },
      {
        name: "description",
        content:
          "Dump your task list and get a prioritized, time-blocked daily or weekly schedule with clear trade-offs.",
      },
      { property: "og:title", content: "AI Task Planner & Scheduler — Workplace AI" },
      {
        property: "og:description",
        content: "Prioritized, time-blocked plans built from your raw task list.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell title="AI Task Planner" description="Prioritized, time-blocked daily & weekly plans">
      <TaskWorkspace
        taskId="planner"
        inputLabel="List your tasks, deadlines and constraints"
        placeholder="e.g. Finish board deck (due Thu), 3 interviews, review Ana's PR, gym, 1:1 with Sam, inbox zero. Working hours 9–6, no meetings before 10."
        extraLabel="Planning horizon & working hours (optional)"
        extraPlaceholder="e.g. Plan Monday–Friday, 9am–5pm, Wednesdays are meeting-free"
        tones={["Balanced", "Aggressive", "Deep-work heavy", "Meeting-light"]}
        samples={[
          {
            label: "Sample day",
            value:
              "Board deck draft (due tomorrow, ~3h), 2 candidate interviews (1h each, must be before 3pm), review two PRs, write launch comms, 30 min 1:1 with Sam, clear inbox. Working 9–6 with a 1pm lunch.",
          },
        ]}
        outputTitle="Schedule"
      />
    </AppShell>
  );
}
