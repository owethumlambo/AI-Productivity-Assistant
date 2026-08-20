import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Bot, Loader2, Send, Trash2, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chat } from "@/lib/assistant.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant about emails, meetings, planning, difficult conversations and process questions.",
      },
      { property: "og:title", content: "Assistant Chat — Workplace AI" },
      {
        property: "og:description",
        content: "An interactive workplace assistant with prompt suggestions.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me say no to extra scope without damaging the relationship",
  "Write a 3-bullet status update for my manager about a slipping deadline",
  "How should I structure a 30-minute retro for a team of six?",
  "Give me an agenda and talking points for a tough performance 1:1",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const send = useServerFn(chat);
  const mutation = useMutation({
    mutationFn: (msgs: Msg[]) => send({ data: { messages: msgs } } as never),
    onSuccess: (res) =>
      setMessages((m) => [...m, { role: "assistant", content: (res as { text: string }).text }]),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const submit = (text: string) => {
    const clean = text.trim();
    if (!clean || mutation.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content: clean }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <AppShell title="Assistant Chat" description="Your interactive workplace copilot">
      <div className="surface-panel mx-auto flex h-[calc(100vh-15rem)] min-h-[28rem] w-full max-w-3xl flex-col rounded-2xl">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Bot className="size-4 text-primary" />
          <p className="font-display text-sm font-semibold">Workplace assistant</p>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => {
                setMessages([]);
                mutation.reset();
              }}
            >
              <Trash2 className="size-4" /> New chat
            </Button>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="py-6 text-center">
              <Bot className="mx-auto mb-3 size-8 text-primary" />
              <p className="font-display text-sm font-semibold">What are we tackling today?</p>
              <p className="mb-4 text-xs text-muted-foreground">Try one of these prompts.</p>
              <div className="mx-auto grid max-w-xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-xl border border-border p-3 text-left text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                  <Bot className="size-4" />
                </span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                } [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p+p]:mt-2 [&_strong]:font-semibold`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              {m.role === "user" && (
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                  <User className="size-4" />
                </span>
              )}
            </div>
          ))}

          {mutation.isPending && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </p>
          )}
          {mutation.isError && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {(mutation.error as Error).message}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask about an email, a meeting, a plan… (Enter to send)"
              className="max-h-40 min-h-11 resize-none text-sm"
              aria-label="Message"
            />
            <Button
              onClick={() => submit(input)}
              disabled={!input.trim() || mutation.isPending}
              size="icon"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            AI can make mistakes — verify anything important before you act on it.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
