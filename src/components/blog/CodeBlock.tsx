"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function CodeBlock({ children, className }: { children: string, className?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") || "text";
  
  return (
    <div style={{ margin: "1.5rem 0", borderRadius: "0.75rem", overflow: "hidden", border: "1px solid #444", direction: "ltr" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 1rem", backgroundColor: "#21252b", borderBottom: "1px solid #444" }}>
        <span style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase", fontFamily: "monospace" }}>{lang}</span>
        <button 
          onClick={() => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
        >
          {copied ? <><Check size={14} color="#22c55e" /> <span style={{ color: "#22c55e" }}>Copied!</span></> : <><Copy size={14} /> <span>Copy</span></>}
        </button>
      </div>
      <div style={{ overflowX: "auto", backgroundColor: "#282c34" }}>
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