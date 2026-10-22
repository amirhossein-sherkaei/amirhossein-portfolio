"use client";

import React, { useEffect, useRef } from "react";
import { type WalineInstance, type WalineInitOptions, init } from "@waline/client";
import "@waline/client/style";
import "@/styles/waline-custom.css";

export type WalineOptions = Omit<WalineInitOptions, "el"> & { path: string };

export default function BlogComments(props: WalineOptions) {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
      lang: "fa",
      locale: {
        placeholder: "دیدگاه خود را اینجا بنویسید...",
        sofa: "هنوز دیدگاهی ثبت نشده. اولین نفر باشید!",
        submit: "ثبت دیدگاه",
        login: "ورود",
        logout: "خروج",
        comment: "دیدگاه",
        nick: "نام شما",
        mail: "ایمیل شما",
        link: "وب‌سایت (اختیاری)",
        preview: "پیش‌نمایش",
        emoji: "شکلک",
        gif: "تصویر متحرک",
        upload: "آپلود",
        cancel: "لغو",
        reply: "پاسخ",
        delete: "حذف",
        edit: "ویرایش",
        verify: "تایید",
        "comment-count": "تعداد دیدگاه‌ها",
        "comment-empty": "هنوز دیدگاهی وجود ندارد",
        "comment-not-found": "دیدگاهی یافت نشد",
        "comment-loading": "در حال بارگذاری...",
        "comment-load-more": "بارگذاری بیشتر",
        "comment-reply": "پاسخ به",
        "comment-reply-placeholder": "پاسخ خود را بنویسید...",
        "comment-reply-submit": "ثبت پاسخ",
        "comment-upload-image": "آپلود تصویر",
        "comment-sort-newest": "جدیدترین",
        "comment-sort-oldest": "قدیمی‌ترین",
        "comment-sort-hottest": "داغ‌ترین",
        "comment-count-unit": "دیدگاه",
        "comment-wait": "لطفاً صبر کنید...",
      },
      requiredMeta: ["nick"],
      login: "disable",
      dark: "html[data-theme='dark']",
    });

    return () => {
      walineInstanceRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (walineInstanceRef.current) {
      walineInstanceRef.current.update(props);
    }
  }, [props]);

  return (
    <section className="waline-wrapper">
      <h2 className="waline-header-title">گفتگو و دیدگاه‌ها</h2>
      <div ref={containerRef} />
    </section>
  );
}