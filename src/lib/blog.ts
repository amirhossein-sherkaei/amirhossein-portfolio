import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateFormatted: string;
  readingTime: number;
  tags: string[];
  category: string;
  featured: boolean;
  content?: string;
  toc?: TOCItem[];
};

export type TOCItem = {
  id: string;
  title: string;
  level: number;
};

/* ─── Get all posts ─── */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const wordCount = content.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        date: data.date || "",
        dateFormatted: formatDate(data.date),
        readingTime,
        tags: data.tags || [],
        category: data.category || "عمومی",
        featured: data.featured || false,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ─── Get single post ─── */
export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const toc = extractTOC(content);

  return {
    slug,
    title: data.title || slug,
    excerpt: data.excerpt || "",
    date: data.date || "",
    dateFormatted: formatDate(data.date),
    readingTime,
    tags: data.tags || [],
    category: data.category || "عمومی",
    featured: data.featured || false,
    content,
    toc,
  };
}

/* ─── Get all unique tags ─── */
export function getAllTags(): { tag: string; count: number }[] {
  const allPosts = getAllPosts();
  const tagMap = new Map<string, number>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/* ─── Get related posts ─── */
export function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  limit: number = 3
): BlogPost[] {
  const allPosts = getAllPosts().filter((p) => p.slug !== currentSlug);

  return allPosts
    .map((post) => ({
      ...post,
      score: post.tags.filter((tag) => currentTags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/* ─── Extract TOC ─── */
function extractTOC(content: string): TOCItem[] {
  const headings: TOCItem[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF\s-]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ id, title, level });
    }
  });

  return headings;
}

/* ─── Format date ─── */
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}
/* ─── Get latest N posts (for homepage) ─── */
export function getLatestPosts(limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}