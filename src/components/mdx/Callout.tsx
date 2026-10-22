import React from "react";

type CalloutType = "info" | "warning" | "success" | "tip";

const styles = {
  info: { border: "#0D7377", bg: "rgba(13, 115, 119, 0.08)", icon: "ℹ️" },
  warning: { border: "#EAB308", bg: "rgba(234, 179, 8, 0.08)", icon: "⚠️" },
  success: { border: "#22C55E", bg: "rgba(34, 197, 94, 0.08)", icon: "✅" },
  tip: { border: "#8B5CF6", bg: "rgba(139, 92, 246, 0.08)", icon: "💡" },
};

export default function Callout({ type = "info", title, children }: { type?: CalloutType; title?: string; children: React.ReactNode }) {
  const style = styles[type];
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1.25rem", borderRadius: "12px", borderLeft: `4px solid ${style.border}`, background: style.bg, margin: "2rem 0" }}>
      <span style={{ fontSize: "1.2rem" }}>{style.icon}</span>
      <div style={{ flex: 1 }}>
        {title && <strong style={{ display: "block", marginBottom: "0.5rem", color: "var(--ink)" }}>{title}</strong>}
        <div style={{ color: "var(--ink-2)", fontSize: "0.95rem", lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  );
}