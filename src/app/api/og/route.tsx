import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug") || "";
    
    if (!slug) {
      return new Response("Missing slug", { status: 400 });
    }
    
    const post = getPostBySlug(slug);
    
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
            backgroundColor: "#f8fafc",
            padding: "60px 80px",
            fontFamily: "system-ui, sans-serif",
            direction: "rtl",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle at 2px 2px, #0d7377 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: "20px", zIndex: 10 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #2ec4c4, #0d7377)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 28, fontWeight: 800 }}>
              AS
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#1c1c1e" }}>امیرحسین شرکائی</span>
              <span style={{ fontSize: 16, color: "#8e8e93" }}>طراحی سایت اختصاصی</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", zIndex: 10 }}>
            <span style={{ fontSize: 24, color: "#0d7377", fontWeight: 700, backgroundColor: "rgba(13, 115, 119, 0.1)", padding: "8px 24px", borderRadius: 99, marginBottom: 30 }}>
              {post.category}
            </span>
            <h1 style={{ fontSize: 64, fontWeight: 900, color: "#1c1c1e", lineHeight: 1.3, margin: 0, maxWidth: 900 }}>
              {post.title}
            </h1>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", zIndex: 10, borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 30 }}>
            <span style={{ fontSize: 20, color: "#8e8e93" }}>{post.readingTime} دقیقه مطالعه</span>
            <span style={{ fontSize: 20, color: "#8e8e93", fontWeight: 700 }}>shorakaei.ir</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response("Error generating image", { status: 500 });
  }
}
