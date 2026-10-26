import { NextResponse } from "next/server";
import { sendProjectRequestEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateProjectRequest } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          message:
            "تعداد درخواست‌ها زیاد است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    const body = await request.json();

    if (
      body &&
      typeof body.website === "string" &&
      body.website.trim().length > 0
    ) {
      return NextResponse.json(
        {
          message: "درخواست با موفقیت دریافت شد.",
        },
        { status: 200 }
      );
    }

    const validation = validateProjectRequest(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.message,
        },
        { status: 400 }
      );
    }

    await sendProjectRequestEmail(validation.data);

    return NextResponse.json(
      {
        message: "درخواست پروژه با موفقیت ارسال شد.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Project request error:", error);

    return NextResponse.json(
      {
        message:
          "خطایی در ارسال درخواست رخ داد. لطفاً دوباره تلاش کنید.",
      },
      { status: 500 }
    );
  }
}