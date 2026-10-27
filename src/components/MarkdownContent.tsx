import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import Callout from "@/components/mdx/Callout";
import Stat from "@/components/mdx/Stat";
import { Steps, Step } from "@/components/mdx/Steps";

const components = {
  Callout,
  Stat,
  Steps,
  Step,
};

// Cast to any to avoid type mismatch between next-mdx-remote and rehype-pretty-code
const options: any = {
  mdxOptions: {
    rehypePlugins: [
      [rehypePrettyCode, { theme: "github-dark" }],
    ],
  },
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <MDXRemote source={content} components={components} options={options} />
  );
}
