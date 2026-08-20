import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TaskWorkspace } from "@/components/TaskWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Summarize articles and reports into key insights, caveats and actionable recommendations you can act on today.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Article summaries, key insights and actionable recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell title="AI Research Assistant" description="Summaries, insights and next steps">
      <TaskWorkspace
        taskId="research"
        inputLabel="Paste an article, report or topic brief"
        placeholder="Paste the text you want analysed. The assistant only works from what you provide — it does not browse the web."
        extraLabel="What decision are you making? (optional)"
        extraPlaceholder="e.g. Deciding whether to move our support team to a new helpdesk tool"
        samples={[
          {
            label: "Sample brief",
            value:
              "Internal report: support ticket volume rose 38% year over year while headcount stayed flat. First response time slipped from 2h to 9h. 42% of tickets are password resets and billing questions. Customer satisfaction fell from 4.5 to 3.9. Budget for one new hire exists next quarter.",
          },
        ]}
        outputTitle="Research brief"
        aside={
          <p className="rounded-xl border border-border p-3 text-xs text-muted-foreground">
            This assistant does not browse the internet. It analyses only the text you paste, so
            check any claim it makes against your original source.
          </p>
        }
      />
    </AppShell>
  );
}
