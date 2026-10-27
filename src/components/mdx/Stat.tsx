import React from "react";

export default function Stat({ value, label, suffix = "" }: { value: string, label: string, suffix?: string }) {
  return (
    <div className="mdx-stat">
      <div className="mdx-stat-value">
        {value}<span className="mdx-stat-suffix">{suffix}</span>
      </div>
      <div className="mdx-stat-label">{label}</div>
    </div>
  );
}
