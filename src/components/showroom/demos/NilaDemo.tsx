"use client";

import { useState, useCallback } from "react";
import "./nila-demo.css";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  gradient: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  gradient: string;
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "پالتو پشمی بلند",
    price: 4200000,
    category: "پالتو",
    gradient: "linear-gradient(160deg, #d4a574 0%, #8b5a3c 100%)",
  },
  {
    id: "p2",
    name: "پیراهن ابریشمی",
    price: 2800000,
    category: "پیراهن",
    gradient: "linear-gradient(160deg, #e8dfd3 0%, #b8a08a 100%)",
  },
  {
    id: "p3",
    name: "کت پشمی کلاسیک",
    price: 4900000,
    category: "کت",
    gradient: "linear-gradient(160deg, #8b3a4a 0%, #4d1f29 100%)",
  },
  {
    id: "p4",
    name: "شلوار کتان مشکی",
    price: 1950000,
    category: "شلوار",
    gradient: "linear-gradient(160deg, #3d3631 0%, #1a1613 100%)",
  },
  {
    id: "p5",
    name: "شال ابریشمی طلایی",
    price: 1250000,
    category: "اکسسوری",
    gradient: "linear-gradient(160deg, #c9a961 0%, #8a7145 100%)",
  },
  {
    id: "p6",
    name: "بلوز نخی کرِم",
    price: 1650000,
    category: "بلوز",
    gradient: "linear-gradient(160deg, #f4efe7 0%, #c9b8a0 100%)",
  },
];

const faNum = (n: number) => n.toLocaleString("fa-IR");

export default function NilaDemo() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          gradient: product.gradient,
        },
      ];
    });
    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 1200);
  }, []);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i));
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const reset = () => {
    setCart([]);
    setCartOpen(false);
    setJustAdded(null);
  };

  return (
    <div className="nila-demo" dir="rtl">
      {/* Reset button */}
      {cart.length > 0 && (
        <button
          type="button"
          className="showroom-demo-reset"
          onClick={reset}
          aria-label="بازنشانی سبد خرید"
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          بازنشانی
        </button>
      )}

      {/* Header */}
      <header className="nila-header">
        <div className="nila-brand">
          <span className="nila-brand-name">نیلا</span>
          <span className="nila-brand-dot" aria-hidden="true" />
        </div>

        <button
          type="button"
          className="nila-cart-btn"
          onClick={() => setCartOpen(true)}
          aria-label={`باز کردن سبد خرید (${faNum(cartCount)} محصول)`}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cartCount > 0 && (
            <span className="nila-cart-badge">{faNum(cartCount)}</span>
          )}
        </button>
      </header>

      {/* Products */}
      <div className="nila-products">
        {PRODUCTS.map((p) => {
          const isAdded = justAdded === p.id;
          return (
            <article key={p.id} className="nila-product">
              <div
                className="nila-product-visual"
                style={{ background: p.gradient }}
                aria-hidden="true"
              >
                <div className="nila-product-mark">{p.category}</div>
              </div>
              <div className="nila-product-info">
                <div className="nila-product-name">{p.name}</div>
                <div className="nila-product-price">
                  {faNum(p.price)} تومان
                </div>
              </div>
              <button
                type="button"
                className={`nila-add-btn ${isAdded ? "is-added" : ""}`}
                onClick={() => addToCart(p)}
                aria-label={`افزودن ${p.name} به سبد`}
              >
                {isAdded ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    افزوده شد
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    افزودن به سبد
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>

      {/* Cart overlay */}
      <div
        className={`nila-cart-overlay ${cartOpen ? "is-open" : ""}`}
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />

      {/* Cart drawer */}
      <aside
        className={`nila-cart-drawer ${cartOpen ? "is-open" : ""}`}
        aria-label="سبد خرید"
        aria-hidden={!cartOpen}
      >
        <div className="nila-cart-head">
          <div>
            <div className="nila-cart-title">سبد خرید</div>
            <div className="nila-cart-count">
              {cartCount === 0 ? "خالی" : `${faNum(cartCount)} محصول`}
            </div>
          </div>
          <button
            type="button"
            className="nila-cart-close"
            onClick={() => setCartOpen(false)}
            aria-label="بستن سبد خرید"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="nila-cart-items">
          {cart.length === 0 ? (
            <div className="nila-cart-empty">
              <div className="nila-cart-empty-icon" aria-hidden="true">
                ◯
              </div>
              <p>سبد خرید شما خالی است.</p>
              <button
                type="button"
                className="nila-cart-empty-btn"
                onClick={() => setCartOpen(false)}
              >
                مشاهده‌ی محصولات
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="nila-cart-item">
                <div
                  className="nila-cart-item-visual"
                  style={{ background: item.gradient }}
                  aria-hidden="true"
                />
                <div className="nila-cart-item-info">
                  <div className="nila-cart-item-name">{item.name}</div>
                  <div className="nila-cart-item-price">
                    {faNum(item.price)} تومان
                  </div>
                  <div className="nila-cart-item-qty">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      aria-label={`کاهش تعداد ${item.name}`}
                    >
                      −
                    </button>
                    <span>{faNum(item.qty)}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      aria-label={`افزایش تعداد ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="nila-cart-item-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={`حذف ${item.name}`}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="nila-cart-foot">
            <div className="nila-cart-total">
              <span className="nila-cart-total-label">جمع کل</span>
              <span className="nila-cart-total-value">
                {faNum(cartTotal)} تومان
              </span>
            </div>
            <div className="nila-cart-note">
              این یک دموی آزمایشی است — پرداخت واقعی انجام نمی‌شود.
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}