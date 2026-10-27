import React from "react";

export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="mdx-steps">{children}</div>;
}

export function Step({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mdx-step">
      <div className="mdx-step-marker"></div>
      <div className="mdx-step-content">
        <h4 className="mdx-step-title">{title}</h4>
        <div className="mdx-step-body">{children}</div>
      </div>
    </div>
  );
}
