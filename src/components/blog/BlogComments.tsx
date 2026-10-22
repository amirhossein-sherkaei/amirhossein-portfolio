"use client";
import Giscus from "@giscus/react";
import { useTheme } from "@/components/ThemeProvider";

export default function BlogComments() {
  const { theme } = useTheme();

  return (
    <section className="blog-comments-section" style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--line-strong)" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--ink)" }}>دیدگاه‌ها</h2>
      <Giscus
        repo="amirhossein-sherkaei/blog-comments" // Replace with your GitHub repo
        repoId="R_kgDOL..." // Replace with your repo ID from giscus.app
        category="Blog Comments"
        categoryId="DIC_kwDOL..." // Replace with your category ID
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === "dark" ? "dark" : "light"}
        lang="fa"
        loading="lazy"
      />
    </section>
  );
}