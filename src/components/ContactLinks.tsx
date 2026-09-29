import { contacts } from "@/content/contacts";

/* ═══════════════════════════════════════════════════════════
   CONTACT LINKS — Editorial contact cards
   ────────────────────────────────────────────────────────────
   Three elegant cards with brand icons.
   Used in Footer + Final CTA.
   ═══════════════════════════════════════════════════════════ */

type Variant = "card" | "inline";

type Props = {
  variant?: Variant;
  className?: string;
  /** aria-label context for accessibility */
  ariaLabel?: string;
};

export default function ContactLinks({
  variant = "card",
  className = "",
  ariaLabel = "راه‌های تماس",
}: Props) {
  if (variant === "inline") {
    return (
      <ul
        className={`contact-links-inline ${className}`.trim()}
        aria-label={ariaLabel}
      >
        {contacts.map((c) => (
          <li key={c.id}>
            <a
              href={c.href}
              {...(c.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`contact-link-inline contact-link-inline--${c.id}`}
            >
              <span className="contact-link-inline-icon" aria-hidden="true">
                <ContactIcon id={c.id} />
              </span>
              <span className="contact-link-inline-label">{c.label}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={`contact-links-grid ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {contacts.map((c) => (
        <li key={c.id}>
          <a
            href={c.href}
            {...(c.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={`contact-card contact-card--${c.id}${
              c.primary ? " contact-card--primary" : ""
            }`}
          >
            <span className="contact-card-icon" aria-hidden="true">
              <ContactIcon id={c.id} />
            </span>

            <span className="contact-card-body">
              <span className="contact-card-label">{c.label}</span>
              <span className="contact-card-value" dir="ltr">
                {c.value}
              </span>
            </span>

            <span className="contact-card-arrow" aria-hidden="true">
              {c.external ? "↗" : "←"}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICONS — minimal, brand-neutral
   ═══════════════════════════════════════════════════════════ */

function ContactIcon({ id }: { id: "rubika" | "eitaa" | "sms" }) {
  switch (id) {
    case "rubika":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "eitaa":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    case "sms":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="13" y2="13" />
        </svg>
      );
  }
}