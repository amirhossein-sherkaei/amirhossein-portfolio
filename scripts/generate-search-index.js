const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const blogDir = path.join(process.cwd(), "src/content/blog");
const publicDir = path.join(process.cwd(), "public");

function generateSearchIndex() {
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
  const index = files.map((file) => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const { data } = matter(content);
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title || "",
      excerpt: data.excerpt || "",
      category: data.category || "",
    };
  });

  fs.writeFileSync(path.join(publicDir, "search-index.json"), JSON.stringify(index));
  console.log(`✅ Generated search index with ${index.length} articles.`);
}

generateSearchIndex();
