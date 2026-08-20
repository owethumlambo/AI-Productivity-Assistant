import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bot,
  CalendarClock,
  LayoutDashboard,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  ShieldAlert,
  Sparkles,
  Sun,
  Telescope,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsibleAiDialog } from "@/components/ResponsibleAiNotice";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, blurb: "Metrics & quick links" },
  { to: "/email", label: "Email Generator", icon: Mail, blurb: "Tone-tuned drafts" },
  { to: "/notes", label: "Meeting Notes", icon: NotebookPen, blurb: "Summaries & actions" },
  { to: "/planner", label: "Task Planner", icon: CalendarClock, blurb: "Prioritized schedule" },
  { to: "/research", label: "Research", icon: Telescope, blurb: "Insights & next steps" },
  { to: "/chat", label: "Assistant Chat", icon: Bot, blurb: "Ask anything" },
] as const;

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(initial);
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return {
    theme: theme ?? "light",
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const sidebar = (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4">
      <Link to="/" className="flex items-center gap-3 px-1">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold text-sidebar-foreground">
            Workplace AI
          </span>
          <span className="block text-xs text-muted-foreground">Productivity Assistant</span>
        </span>
      </Link>

      <nav className="grid gap-1" aria-label="Main">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground glow-ring"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className={`size-4 ${active ? "text-primary" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-sidebar-border p-3 text-xs text-muted-foreground">
        <p className="mb-2 flex items-center gap-2 font-medium text-sidebar-foreground">
          <ShieldAlert className="size-4 text-accent" /> Responsible AI
        </p>
        <p>AI output can be wrong. Review facts before sending or sharing.</p>
        <ResponsibleAiDialog>
          <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
            Read the notice
          </Button>
        </ResponsibleAiDialog>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-sidebar-border shadow-xl">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-semibold sm:text-lg">{title}</h1>
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto"
            aria-label="Toggle theme"
            onClick={toggle}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="border-t border-border px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p className="flex flex-wrap items-center gap-2">
            <ShieldAlert className="size-4 shrink-0 text-accent" />
            <span>
              Responsible AI notice: outputs are generated by AI and may be inaccurate or
              incomplete. Fact-check before acting. Don't paste confidential or personal data — your
              input is sent to an AI model for processing and is not stored by this app.
            </span>
            <ResponsibleAiDialog>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Full notice & privacy
              </Button>
            </ResponsibleAiDialog>
          </p>
        </footer>
      </div>

      {open && <span className="sr-only"><X className="size-0" /></span>}
    </div>
  );
}
