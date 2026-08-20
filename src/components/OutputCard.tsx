import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Pencil, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function OutputCard({
  title,
  text,
  onReset,
}: {
  title: string;
  text: string;
  onReset?: () => void;
}) {
  const [draft, setDraft] = useState(text);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDraft(text);
    setEditing(false);
  }, [text]);

  const copy = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="surface-panel rounded-2xl p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="font-display text-sm font-semibold">{title}</h2>
        <div className="ml-auto flex gap-1">
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="size-4" /> Clear
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setEditing((v) => !v)}>
            {editing ? <Save className="size-4" /> : <Pencil className="size-4" />}
            {editing ? "Done" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      {editing ? (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="min-h-72 text-sm"
          aria-label="Editable output"
        />
      ) : (
        <div className="markdown-body space-y-3 text-sm leading-relaxed [&_h3]:mt-4 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:text-foreground/90 [&_table]:w-full [&_table]:text-left [&_td]:border-t [&_td]:border-border [&_td]:py-1.5 [&_td]:pr-3 [&_th]:pb-2 [&_th]:pr-3 [&_th]:font-semibold">
          <ReactMarkdown>{draft}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}
