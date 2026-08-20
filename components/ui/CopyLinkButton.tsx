"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Link2 } from "lucide-react";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(path);

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
  }, [path]);

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-canvas px-3 py-2.5">
      <Link2 size={13} className="shrink-0 text-slate" />
      <span className="min-w-0 flex-1 truncate text-xs text-navy">{url}</span>
      <button
        type="button"
        onClick={copy}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-ink transition hover:border-navy/30 hover:text-navy"
      >
        {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
