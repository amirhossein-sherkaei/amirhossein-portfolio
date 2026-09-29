/* ═══════════════════════════════════════════════════════════
   CONTACTS — Single source of truth
   ────────────────────────────────────────────────────────────
   To change the phone number: update `PHONE_RAW` below.
   Format: +98XXXXXXXXXX (international, no spaces)
   ═══════════════════════════════════════════════════════════ */

export type ContactId = "rubika" | "eitaa" | "sms";

export type Contact = {
  id: ContactId;
  label: string;
  short: string;
  href: string;
  external: boolean;
  /** Display value (e.g. @username or phone number) */
  value: string;
  primary?: boolean;
};

/* ═══════════════════════════════════════════════════════════
   PHONE — UPDATE THESE LINES ONLY
   ═══════════════════════════════════════════════════════════ */
const PHONE_RAW = "+989371932549"; // ← برای لینک sms: (بین‌المللی)
const PHONE_DISPLAY = "۰۹۳۷ ۱۹۳ ۲۵۴۹"; // ← برای نمایش

/* ═══════════════════════════════════════════════════════════ */

export const contacts: Contact[] = [
  {
    id: "rubika",
    label: "روبیکا",
    short: "Rubika",
    href: "https://rubika.ir/Amirhosein2076",
    external: true,
    value: "@Amirhosein2076",
  },
  {
    id: "eitaa",
    label: "ایتا",
    short: "Eitaa",
    href: "https://eitaa.com/AmirHosseinsherakaei",
    external: true,
    value: "@AmirHosseinsherakaei",
  },
  {
    id: "sms",
    label: "پیامک",
    short: "SMS",
    href: `sms:${PHONE_RAW}`,
    external: false,
    value: PHONE_DISPLAY,
    primary: true,
  },
];

export const primaryContact = contacts.find((c) => c.primary)!;