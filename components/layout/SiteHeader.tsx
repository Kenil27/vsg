import Link from "next/link";

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-emerald-800 dark:text-emerald-400"
        >
          Vihar
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/" className={linkClass}>
            Home
          </Link>
          <Link href="/admin" className={linkClass}>
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
