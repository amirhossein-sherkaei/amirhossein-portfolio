"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "20vh",
      }}
      dir="rtl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "480px",
          background: "#09090b", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px", padding: "16px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        <p style={{ color: "#fff", fontSize: "14px", marginBottom: "12px", fontWeight: 500 }}>
          دستورات سریع (Ctrl + K)
        </p>
        {[
          { label: "صفحه اصلی", path: "/" },
          { label: "مقالات وبلاگ", path: "/blog" },
          { label: "نمونه‌کارها", path: "/work" },
          { label: "سفارش پروژه", path: "/order" },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => go(item.path)}
            style={{
              display: "block", width: "100%", textAlign: "right",
              padding: "10px 12px", background: "transparent",
              border: "none", color: "#d1d5db", fontSize: "14px",
              borderRadius: "8px", cursor: "pointer", marginBottom: "4px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {item.label}
          </button>
        ))}
        <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "12px", textAlign: "center" }}>
          ESC برای بستن
        </p>
      </div>
    </div>
  );
}