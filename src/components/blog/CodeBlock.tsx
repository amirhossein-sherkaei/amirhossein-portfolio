"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const language = className?.replace("language-", "") || "text";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl" dir="ltr">
      {/* هدر بلاک کد */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* دکمه‌های مک */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="ml-4 text-xs font-mono text-gray-400 uppercase tracking-wider">
            {language}
          </span>
        </div>
        
        {/* دکمه کپی */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          aria-label="Copy code"
        >
          {isCopied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* بدنه کد */}
      <div className="overflow-x-auto p-4 text-sm font-mono leading-relaxed">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 0,
            background: "transparent",
          }}
          showLineNumbers={true}
          lineNumberStyle={{ color: "#4b5563", minWidth: "2.5em", paddingRight: "1em" }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}