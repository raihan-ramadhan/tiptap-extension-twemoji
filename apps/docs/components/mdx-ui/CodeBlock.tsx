"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import copy from "copy-to-clipboard";

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  const textRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!textRef.current) return;
    const text = textRef.current.innerText;
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre
        ref={textRef}
        className="overflow-x-auto rounded-lg bg-secondary text-sm p-4"
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 min-[768px]:p-2 rounded-md border border-muted-foreground text-muted-foreground/50 min-[768px]:opacity-0 min-[768px]:group-hover:opacity-100 transition-opacity duration-500 cursor-pointer flex gap-1 items-center"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="size-3 text-green-400 min-[768px]:size-4 " />
        ) : (
          <Copy className="size-3 min-[768px]:size-4" />
        )}

        <span className="min-[768px]:hidden text-xs">Copy</span>
      </button>
    </div>
  );
}
