"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function CodeBlock({ children, className }: { children: string, className?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") || "text";
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-6 w-full rounded-xl overflow-hidden border border-gray-700 bg-[#282c34] shadow-lg" dir="ltr">
      <div className="flex items-center justify-between px-4 py-2 bg-[#21252b] border-b border-gray-700">
        <span className="text-xs font-mono text-gray-400 uppercase">{lang}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition">
          {copied ? <><Check size={14} className="text-green-500" /> Copied!</> : <><Copy size={14} /> Copy</>}
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <SyntaxHighlighter 
          language={lang} 
          style={oneDark} 
          customStyle={{ margin: 0, padding: "1rem", background: "transparent", fontSize: "0.875rem" }} 
          showLineNumbers
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}