import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TaskWorkspace } from "@/components/TaskWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Turn a rough intent into a ready-to-send workplace email in formal, friendly or persuasive tones, then edit and copy it.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Draft professional emails in seconds with tone control and editable output.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell title="Smart Email Generator" description="Say what you mean — get a sendable draft">
      <TaskWorkspace
        taskId="email"
        inputLabel="What should the email say?"
        placeholder="e.g. Tell the vendor we're delaying rollout by two weeks, ask them to confirm new dates, keep the relationship warm."
        extraLabel="Recipient & context (optional)"
        extraPlaceholder="e.g. Priya, account manager at Northwind; we've missed one deadline already"
        tones={["Formal", "Friendly", "Persuasive", "Direct", "Apologetic"]}
        samples={[
          {
            label: "Decline a meeting",
            value:
              "Politely decline the Thursday roadmap meeting because of a client deadline, offer async notes instead, and ask for the recording.",
          },
          {
            label: "Chase an invoice",
            value:
              "Follow up on invoice #1042, 21 days overdue, ask for payment date, stay professional and keep the relationship intact.",
          },
        ]}
        outputTitle="Email draft"
      />
    </AppShell>
  );
}
