"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react"; // or any icon library you like

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  const textRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!textRef.current) return;
    const text = textRef.current.innerText;
    await navigator.clipboard.writeText(text);
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
        className="absolute top-2 right-2 p-2 rounded-md border border-muted-foreground text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
