import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Copy,
  FileText,
  ListChecks,
  Mail,
  Sparkles,
  Wand2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runTask } from "@/lib/assistant.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Summarize documents, draft emails, extract action items and plan meetings in seconds with an AI assistant built for busy professionals.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Turn messy notes into briefs, emails, action items and agendas with AI built for the workday.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TASKS = [
  {
    id: "summarize" as const,
    label: "Summarize",
    blurb: "Long doc or thread → executive brief",
    icon: FileText,
    placeholder: "Paste a report, thread or transcript to condense…",
  },
  {
    id: "email" as const,
    label: "Draft email",
    blurb: "Rough intent → ready-to-send message",
    icon: Mail,
    placeholder: "e.g. Tell the vendor we're delaying the rollout by two weeks…",
  },
  {
    id: "actions" as const,
    label: "Action items",
    blurb: "Meeting notes → owners and dates",
    icon: ListChecks,
    placeholder: "Paste your raw meeting notes…",
  },
  {
    id: "rewrite" as const,
    label: "Rewrite",
    blurb: "Clunky text → clear and concise",
    icon: Wand2,
    placeholder: "Paste the message you want tightened up…",
  },
  {
    id: "agenda" as const,
    label: "Meeting agenda",
    blurb: "Topic → timeboxed plan",
    icon: CalendarClock,
    placeholder: "e.g. Quarterly planning for the support team, 45 minutes…",
  },
];

const TONES = ["Neutral", "Friendly", "Direct", "Formal", "Persuasive"];

function Index() {
  const [taskId, setTaskId] = useState<(typeof TASKS)[number]["id"]>("summarize");
  const [content, setContent] = useState("");
  const [tone, setTone] = useState("Neutral");
  const [copied, setCopied] = useState(false);

  const run = useServerFn(runTask);
  const mutation = useMutation({
    mutationFn: (vars: { taskId: string; content: string; tone: string }) =>
      run({ data: vars } as never),
  });

  const active = TASKS.find((t) => t.id === taskId)!;
  const output = (mutation.data as { text: string } | undefined)?.text ?? "";

  const submit = () => {
    if (!content.trim() || mutation.isPending) return;
    setCopied(false);
    mutation.mutate({ taskId, content, tone });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-5 py-10 sm:px-8 lg:py-16">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">Workplace Assistant</p>
            <p className="text-xs text-muted-foreground">AI for the busy workday</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" })}>
          Open workspace <ArrowRight className="size-4" />
        </Button>
      </header>

      <section className="max-w-3xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" /> Five automations, one paste box
        </p>
        <h1 className="text-4xl font-bold leading-[1.05] sm:text-6xl">
          Automate the busywork.
          <br />
          <span className="text-signal">Keep the thinking.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Paste notes, threads or half-formed ideas. Get back an executive brief, a sendable email,
          a clean action list or a timeboxed agenda — in seconds.
        </p>
      </section>

      <section id="workspace" className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" aria-label="Assistant tasks">
          {TASKS.map((task) => {
            const Icon = task.icon;
            const selected = task.id === taskId;
            return (
              <button
                key={task.id}
                onClick={() => {
                  setTaskId(task.id);
                  mutation.reset();
                }}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  selected
                    ? "border-primary/60 bg-card glow-ring"
                    : "border-border bg-card/40 hover:bg-card"
                }`}
                aria-pressed={selected}
              >
                <Icon className={`mt-0.5 size-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                <span>
                  <span className="block font-display text-sm font-semibold">{task.label}</span>
                  <span className="block text-xs text-muted-foreground">{task.blurb}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="surface-panel rounded-3xl p-5 sm:p-7">
          <label htmlFor="input" className="font-display text-lg font-semibold">
            {active.label}
          </label>
          <Textarea
            id="input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={active.placeholder}
            className="mt-3 min-h-44 resize-y bg-background/50 text-sm"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Tone</span>
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  tone === t
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
            <Button className="ml-auto" onClick={submit} disabled={mutation.isPending || !content.trim()}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Working…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Generate
                </>
              )}
            </Button>
          </div>

          {mutation.isError && (
            <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
              {(mutation.error as Error).message}
            </p>
          )}

          {output && (
            <div className="mt-6 rounded-2xl border border-border bg-background/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-display text-sm font-semibold">Result</p>
                <Button variant="ghost" size="sm" onClick={copy}>
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground/90">
                {output}
              </pre>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
        Built for professionals who'd rather ship than format. Nothing you paste is stored.
      </footer>
    </main>
  );
}
