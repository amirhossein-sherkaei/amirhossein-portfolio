import ReactMarkdown from "react-markdown";
import CodeBlock from "@/components/blog/CodeBlock";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code(props: any) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          
          // If it has a language class, it's a code block
          if (match) {
            return (
              <CodeBlock className={className}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          }
          
          // Otherwise, it's inline code
          return (
            <code 
              className={className} 
              style={{ 
                backgroundColor: "#2d2d2d", 
                color: "#e5c07b", 
                padding: "0.2rem 0.4rem", 
                borderRadius: "0.25rem", 
                fontSize: "0.875rem", 
                direction: "ltr", 
                display: "inline-block" 
              }} 
              {...rest}
            >
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