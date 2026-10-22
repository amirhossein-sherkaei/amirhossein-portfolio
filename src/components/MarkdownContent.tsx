import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: "one-dark-pro", // یا github-dark
                  keepBackground: false, // برای اینکه بک‌گراند خودمون اعمال بشه
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}