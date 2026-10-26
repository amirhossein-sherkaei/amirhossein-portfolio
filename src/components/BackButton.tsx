"use client";

export default function BackButton() {
  return (
    <button
      type="button"
      className="button button-secondary"
      onClick={() => window.history.back()}
    >
      صفحه قبلی
    </button>
  );
}