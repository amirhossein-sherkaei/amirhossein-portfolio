"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type Comment = {
  objectId: string;
  nick: string;
  comment: string;
  created: string;
  avatar?: string;
};

export default function BlogComments({ serverURL, path }: { serverURL: string; path: string }) {
  const [formData, setFormData] = useState({ nick: "", mail: "", link: "", comment: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // Fetch comments on load
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`${serverURL}/api/comment?path=${encodeURIComponent(path)}&type=recent&pageSize=50`);
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        // Filter only approved (status = 'approved')
        const approved = data.data.filter((c: any) => c.status === "approved");
        setComments(approved);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [path]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${serverURL}/api/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          url: path,
          ua: navigator.userAgent,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.errno !== 0) {
        throw new Error(data.errmsg || "خطایی در ثبت دیدگاه رخ داد.");
      }

      setStatus("success");
      setMessage("دیدگاه شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.");
      setFormData({ nick: "", mail: "", link: "", comment: "" });
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <section className="waline-wrapper">
      <h2 className="waline-header-title">گفتگو و دیدگاه‌ها</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="custom-comment-form">
        
        <div className="form-row">
          <div className="input-group">
            <input
              type="text"
              id="nick"
              placeholder=" "
              value={formData.nick}
              onChange={(e) => setFormData({ ...formData, nick: e.target.value })}
              required
            />
            <label htmlFor="nick">نام شما</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              id="mail"
              placeholder=" "
              value={formData.mail}
              onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
            />
            <label htmlFor="mail">ایمیل شما (اختیاری)</label>
          </div>
        </div>

        <div className="input-group">
          <input
            type="url"
            id="link"
            placeholder=" "
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
          <label htmlFor="link">وب‌سایت شما (اختیاری)</label>
        </div>

        <div className="input-group">
          <textarea
            id="comment"
            placeholder=" "
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            required
          />
          <label htmlFor="comment">دیدگاه خود را اینجا بنویسید...</label>
        </div>

        {message && (
          <div className={`form-message ${status === "success" ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={status === "loading"} className="custom-submit-btn">
          {status === "loading" ? "در حال ثبت..." : "ثبت دیدگاه"}
        </button>
      </form>

      {/* Comments List */}
      <div className="comments-list-wrapper">
        <h3 className="comments-list-title">دیدگاه‌های ثبت شده</h3>
        
        {loadingComments ? (
          <p className="comments-loading">در حال بارگذاری دیدگاه‌ها...</p>
        ) : comments.length === 0 ? (
          <p className="comments-empty">هنوز دیدگاهی ثبت نشده. اولین نفر باشید!</p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.objectId} className="comment-card">
                <div className="comment-header">
                  <div className="comment-avatar">
                    {comment.avatar ? (
                      <Image src={comment.avatar} alt={comment.nick} width={40} height={40} style={{ borderRadius: "50%" }} />
                    ) : (
                      <div className="avatar-placeholder">{comment.nick.charAt(0)}</div>
                    )}
                  </div>
                  <div className="comment-meta">
                    <strong className="comment-nick">{comment.nick}</strong>
                    <span className="comment-date">{new Date(comment.created).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
                <p className="comment-content">{comment.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}