"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type WaTarget = { label: string; wa: string };

type ViharWhatsappPanelProps = {
  message: string;
  /** `wa` is digits only country code + number, e.g. 919820241010 */
  targets: WaTarget[];
};

export function ViharWhatsappPanel({ message, targets }: ViharWhatsappPanelProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [message]);

  const hasMessage = message.trim().length > 0;

  return (
    <Card title="WhatsApp message">
      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
        Preview uses your entries above. Open a chat with the encoded text, or copy
        and paste manually. Numbers are taken from sevak lines (e.g.{" "}
        <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">
          kehul bhai 9820241010
        </code>
        ).
      </p>
      <pre className="mb-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
        {hasMessage ? message : "Complete the form to generate the message."}
      </pre>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          type="button"
          variant="secondary"
          disabled={!hasMessage}
          onClick={() => void copy()}
        >
          {copied ? "Copied" : "Copy message"}
        </Button>
        {targets.map(({ label, wa }) => (
          <a
            key={wa + label}
            href={
              hasMessage
                ? `https://wa.me/${wa}?text=${encodeURIComponent(message)}`
                : undefined
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              hasMessage
                ? "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800"
                : "pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-700"
            }`}
          >
            WhatsApp · {label.length > 28 ? `${label.slice(0, 28)}…` : label}
          </a>
        ))}
      </div>
      {targets.length === 0 && hasMessage ? (
        <p className="mt-3 text-xs text-amber-800 dark:text-amber-200">
          No 10-digit mobile found in Vihar Sainiks (or Updhi sevak). Add numbers to
          sevak names to enable direct links.
        </p>
      ) : null}
    </Card>
  );
}
