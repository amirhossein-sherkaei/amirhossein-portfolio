import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendNewsletterNotification } from "@/lib/email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export async function POST(request: Request) {
  try {
    /* ─── Rate limit ─── */
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    const rate = checkRateLimit(`newsletter:${ip}`);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          message: `تعداد درخواست‌ها زیاده. ${rate.retryAfter} ثانیه دیگه امتحان کن.`,
        },
        { status: 429 }
      );
    }

    /* ─── Parse body ─── */
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "درخواست معتبر نیست." },
        { status: 400 }
      );
    }

    const rawEmail = (body as { email?: unknown }).email;
    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    /* ─── Validate ─── */
    if (!email) {
      return NextResponse.json(
        { message: "ایمیلت رو وارد کن." },
        { status: 400 }
      );
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { message: "ایمیل بیش از حد طولانیه." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "ایمیل معتبر وارد کن." },
        { status: 400 }
      );
    }

    /* ─── Send notification ─── */
    await sendNewsletterNotification(email);

    return NextResponse.json({
      success: true,
      message: "ثبت شد.",
    });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { message: "ثبت نشد. یه بار دیگه امتحان کن." },
      { status: 500 }
    );
  }
}