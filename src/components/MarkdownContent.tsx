import ReactMarkdown from "react-markdown";
import CodeBlock from "@/components/blog/CodeBlock";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code(props: any) {
          const { children, className, node, inline, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          
          // If it's a block of code (has a language class)
          if (!inline && match) {
            return (
              <CodeBlock className={className}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          }
          
          // If it's inline code, style it nicely
          if (inline) {
            return (
              <code className="bg-gray-200 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono" dir="ltr" {...rest}>
                {children}
              </code>
            );
          }

          // Fallback for code blocks without language
          return (
            <CodeBlock className="language-text">
              {String(children).replace(/\n$/, "")}
            </CodeBlock>
          );
        },
        pre(props: any) {
          return <>{props.children}</>;
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}