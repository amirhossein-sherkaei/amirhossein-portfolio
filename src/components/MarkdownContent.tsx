import ReactMarkdown from "react-markdown";
import CodeBlock from "@/components/blog/CodeBlock";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <CodeBlock className={className}>
              {String(children).replace(/\n$/, "")}
            </CodeBlock>
          ) : (
            <code className={className} style={{ backgroundColor: "#2d2d2d", color: "#e5c07b", padding: "0.2rem 0.4rem", borderRadius: "0.25rem", fontSize: "0.875rem", direction: "ltr", display: "inline-block" }} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}