import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen px-4 py-6 text-[var(--text)] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <p className="micro-label text-[var(--muted)]">Codex Lab</p>
            <div className="space-y-4">
              <h1 className="text-[2.5rem] font-semibold leading-none tracking-[-0.05em] text-[var(--text)] sm:text-5xl">
                Member page not found
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
                The page you requested is not part of the current directory.
                Head back to the roster and choose one of the available
                students.
              </p>
            </div>
          </div>

          <Link
            className="tag-button inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-strong)]"
            href="/"
          >
            Back to directory
          </Link>
        </header>
      </div>
    </main>
  );
}
