import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  title: string;
};

export function AppShell({ children, title }: AppShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-primary-text">
      <section className="w-full max-w-xl border border-border bg-surface p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-text">
          Vehicle Analysis Lab
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h1>
        <div className="mt-4 text-secondary-text">{children}</div>
      </section>
    </main>
  );
}
