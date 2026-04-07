import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
};

export function Card({ children, className = "", title }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 ${className}`}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
