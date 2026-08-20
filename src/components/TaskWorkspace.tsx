import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { OutputCard } from "@/components/OutputCard";
import { runTask } from "@/lib/assistant.functions";

type TaskId = "email" | "notes" | "planner" | "research" | "summarize";

export function TaskWorkspace({
  taskId,
  inputLabel,
  placeholder,
  extraLabel,
  extraPlaceholder,
  tones,
  samples,
  outputTitle,
  aside,
}: {
  taskId: TaskId;
  inputLabel: string;
  placeholder: string;
  extraLabel?: string;
  extraPlaceholder?: string;
  tones?: string[];
  samples?: { label: string; value: string }[];
  outputTitle: string;
  aside?: ReactNode;
}) {
  const [content, setContent] = useState("");
  const [extra, setExtra] = useState("");
  const [tone, setTone] = useState(tones?.[0] ?? "");

  const run = useServerFn(runTask);
  const mutation = useMutation({
    mutationFn: (vars: { taskId: TaskId; content: string; tone?: string; extra?: string }) =>
      run({ data: vars } as never),
  });

  const output = (mutation.data as { text: string } | undefined)?.text ?? "";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="surface-panel rounded-2xl p-5">
        <label htmlFor="task-input" className="font-display text-sm font-semibold">
          {inputLabel}
        </label>
        <Textarea
          id="task-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="mt-3 min-h-56 resize-y text-sm"
        />

        {samples && samples.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {samples.map((s) => (
              <button
                key={s.label}
                onClick={() => setContent(s.value)}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {extraLabel && (
          <div className="mt-4">
            <label htmlFor="task-extra" className="text-xs font-medium text-muted-foreground">
              {extraLabel}
            </label>
            <Input
              id="task-extra"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder={extraPlaceholder}
              className="mt-1.5 text-sm"
            />
          </div>
        )}

        {tones && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Tone</span>
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  tone === t
                    ? "border-primary/60 bg-primary/10 font-medium text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <Button
          className="mt-5 w-full sm:w-auto"
          disabled={!content.trim() || mutation.isPending}
          onClick={() =>
            mutation.mutate({
              taskId,
              content,
              ...(tone ? { tone } : {}),
              ...(extra.trim() ? { extra } : {}),
            })
          }
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> Generate
            </>
          )}
        </Button>

        {mutation.isError && (
          <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {(mutation.error as Error).message}
          </p>
        )}

        {aside && <div className="mt-6">{aside}</div>}
      </section>

      {output ? (
        <OutputCard title={outputTitle} text={output} onReset={() => mutation.reset()} />
      ) : (
        <section className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          <Sparkles className="mx-auto mb-3 size-6 text-primary" />
          Your generated {outputTitle.toLowerCase()} appears here. You can edit it inline and copy
          it in one click.
        </section>
      )}
    </div>
  );
}
