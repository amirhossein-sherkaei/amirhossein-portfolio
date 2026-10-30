import ReactMarkdown from "react-markdown";
import CodeBlock from "@/components/blog/CodeBlock";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code(props: any) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodeBlock className={className}>
              {String(children).replace(/\n$/, "")}
            </CodeBlock>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}