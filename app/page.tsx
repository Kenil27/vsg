import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Overview
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Public stats will appear here. This section is ready to connect to
          Firestore aggregates or Cloud Functions next.
        </p>
      </div>
      <Card title="Stats">
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Total entries", value: "—" },
            { label: "This month", value: "—" },
            { label: "Last updated", value: "—" },
            { label: "Top route", value: "—" },
          ].map((item) => (
            <li
              key={item.label}
              className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {item.label}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-white">
                {item.value}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
