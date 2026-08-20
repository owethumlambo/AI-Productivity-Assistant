import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, FileCheck2, Gauge, Sparkles } from "lucide-react";
import { AppShell, NAV } from "@/components/AppShell";
import { ResponsibleAiGate } from "@/components/ResponsibleAiNotice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A modern AI workspace for professionals: draft emails, summarize meetings, plan your day, research faster, and chat with an assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate workplace busywork with AI: emails, meeting notes, planning and research.",
      },
    ],
  }),
  component: Dashboard,
});

const METRICS = [
  { label: "Automations available", value: "5", hint: "Email, notes, planner, research, chat", icon: Sparkles },
  { label: "Avg. time saved / task", value: "12 min", hint: "vs. writing from scratch", icon: Clock },
  { label: "Drafts you control", value: "100%", hint: "Every output is editable", icon: FileCheck2 },
  { label: "Data stored by app", value: "None", hint: "Nothing leaves your session", icon: Gauge },
];

function Dashboard() {
  const quickLinks = NAV.filter((n) => n.to !== "/");

  return (
    <AppShell title="Dashboard" description="Your AI workspace at a glance">
      <ResponsibleAiGate />

      <section className="surface-panel mb-6 overflow-hidden rounded-2xl p-6 sm:p-8">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" /> Built for busy professionals
        </p>
        <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Automate the busywork. <span className="text-signal">Keep the thinking.</span>
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Paste rough notes or a half-formed idea and get a polished email, a structured meeting
          recap, a prioritized schedule, or a research brief — all editable before you send.
        </p>
        <Link
          to="/email"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start with an email draft <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="surface-panel rounded-2xl p-4">
              <Icon className="mb-3 size-5 text-primary" />
              <p className="font-display text-2xl font-semibold">{m.value}</p>
              <p className="text-sm font-medium">{m.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
            </div>
          );
        })}
      </section>

      <section>
        <h3 className="mb-3 font-display text-sm font-semibold text-muted-foreground">
          Quick links
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="surface-panel group flex items-start gap-3 rounded-2xl p-5 transition-colors hover:border-primary/50"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="flex items-center gap-1.5 font-display text-sm font-semibold">
                    {item.label}
                    <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{item.blurb}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
