import { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════
   SECTION NUMBER — Editorial big numeral
   ────────────────────────────────────────────────────────────
   Big Persian numeral next to section headings.
   Usage:
     <SectionNumber num="۰۱" label="SERVICES" />
   ═══════════════════════════════════════════════════════════ */

type Props = {
  num: string;
  label?: string;
  /** Optional decorative rule to the side */
  rule?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function SectionNumber({
  num,
  label,
  rule = true,
  className = "",
  children,
}: Props) {
  return (
    <div className={`section-num ${className}`.trim()}>
      <div className="section-num-figure" aria-hidden="true">
        <span className="section-num-value">{num}</span>
        {rule && <span className="section-num-rule" />}
      </div>

      {label && (
        <span className="section-num-label" aria-hidden="true">
          {label}
        </span>
      )}

      {children}
    </div>
  );
}