import type { ProjectRequestData } from "@/lib/validation";

const EMAILJS_API = "https://api.emailjs.com/api/v1.0/email/send";

export async function sendProjectRequestEmail(
  data: ProjectRequestData
) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Email configuration is incomplete.");
  }

  if (!privateKey) {
    throw new Error("EmailJS private key is missing.");
  }

  const fullName = [data.firstName, data.lastName]
    .filter(Boolean)
    .join(" ");

  const projectTypes = data.projectTypes.join("، ");

  const templateParams = {
    first_name: data.firstName,
    last_name: data.lastName || "وارد نشده",
    phone: data.phone,
    email: data.email || "وارد نشده",
    business_name: data.personalProject
      ? "پروژه شخصی"
      : data.businessName,
    personal_project: data.personalProject ? "بله" : "خیر",
    project_types: projectTypes,
    description: data.description,
    contact_preference: data.contactPreference,

    full_name: fullName,

    from_name: fullName,
    reply_to: data.email || data.phone,
    subject: `درخواست پروژه جدید — ${fullName}`,
    message: data.description,
  };

  const response = await fetch(EMAILJS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `EmailJS error (${response.status}): ${errorText}`
    );
  }
}

/* ═══════════════════════════════════════════════════════════
   NEWSLETTER — Notify owner of new subscriber
   ────────────────────────────────────────────────────────────
   Uses the same EmailJS service. Sends an email to the
   site owner with the new subscriber's email so they can
   add it to their newsletter tool manually.
   ═══════════════════════════════════════════════════════════ */

export async function sendNewsletterNotification(
  subscriberEmail: string
) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error("Email configuration is incomplete.");
  }

  const templateParams = {
    first_name: "خبرنامه",
    last_name: "مشترک جدید",
    phone: "—",
    email: subscriberEmail,
    business_name: "—",
    personal_project: "—",
    project_types: "خبرنامه",
    description: `مشترک جدید خبرنامه:\n${subscriberEmail}`,
    contact_preference: "email",

    full_name: "خبرنامه سایت",

    from_name: "خبرنامه سایت",
    reply_to: subscriberEmail,
    subject: `خبرنامه — مشترک جدید: ${subscriberEmail}`,
    message: `ایمیل جدید در خبرنامه:\n\n${subscriberEmail}\n\nلطفاً به لیست خبرنامه اضافه شود.`,
  };

  const response = await fetch(EMAILJS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS error (${response.status}): ${errorText}`);
  }
}