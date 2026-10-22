import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import Callout from "./mdx/Callout";
import Quote from "./mdx/Quote";

interface MarkdownContentProps {
  content: string;
}

const components = {
  Callout,
  Quote,
};

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: "one-dark-pro",
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}