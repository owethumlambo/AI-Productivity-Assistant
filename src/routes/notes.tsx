import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TaskWorkspace } from "@/components/TaskWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a summary, key decisions, action items with owners, and deadlines you can edit and share.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions, action items and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Summary, decisions, action items and deadlines"
    >
      <TaskWorkspace
        taskId="notes"
        inputLabel="Paste your raw notes or transcript"
        placeholder="Paste everything — bullet fragments, typos and tangents are fine."
        extraLabel="Meeting name & attendees (optional)"
        extraPlaceholder="e.g. Q3 planning — Ana, Ravi, Sam, Priya"
        samples={[
          {
            label: "Sample notes",
            value:
              "Weekly sync. Ana: billing bug still open, says she can ship the fix Friday. Ravi flagged that ops is blocked on the vendor contract — legal has had it 9 days. Sam wants the launch pushed a week; everyone agreed. Priya asked who's writing the customer comms — nobody volunteered. Next check-in Tuesday 10am.",
          },
        ]}
        outputTitle="Meeting recap"
      />
    </AppShell>
  );
}
