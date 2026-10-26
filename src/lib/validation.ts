export type ProjectRequestData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  businessName: string;
  personalProject: boolean;
  projectTypes: string[];
  description: string;
  contactPreference: string;
};

type ValidationResult =
  | {
      success: true;
      data: ProjectRequestData;
    }
  | {
      success: false;
      message: string;
    };

const allowedProjectTypes = new Set([
  "web-custom",
  "web-ai",
  "banner-ai",
  "video-ai",
  "combined",
  "other",
]);

const allowedContactMethods = new Set([
  "sms",
  "rubika",
  "eitaa",
]);

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateProjectRequest(
  body: unknown
): ValidationResult {
  if (!body || typeof body !== "object") {
    return {
      success: false,
      message: "اطلاعات ارسال‌شده معتبر نیست.",
    };
  }

  const data = body as Record<string, unknown>;

  const firstName = cleanText(data.firstName);
  const lastName = cleanText(data.lastName);
  const phone = cleanText(data.phone);
  const email = cleanText(data.email);
  const businessName = cleanText(data.businessName);
  const description = cleanText(data.description);

  const personalProject = data.personalProject === true;

  const projectTypes = Array.isArray(data.projectTypes)
    ? data.projectTypes.filter(
        (item): item is string =>
          typeof item === "string" &&
          allowedProjectTypes.has(item)
      )
    : [];

  const contactPreference = cleanText(data.contactPreference);

  if (!firstName) {
    return {
      success: false,
      message: "لطفاً نام خود را وارد کنید.",
    };
  }

  if (firstName.length > 80 || lastName.length > 80) {
    return {
      success: false,
      message: "نام واردشده بیش از حد طولانی است.",
    };
  }

  if (!phone) {
    return {
      success: false,
      message: "لطفاً شماره موبایل خود را وارد کنید.",
    };
  }

  if (phone.length > 40) {
    return {
      success: false,
      message: "شماره موبایل واردشده بیش از حد طولانی است.",
    };
  }

  if (!personalProject && !businessName) {
    return {
      success: false,
      message:
        "لطفاً نام کسب‌وکار را وارد کنید یا پروژه شخصی را انتخاب کنید.",
    };
  }

  if (businessName.length > 160) {
    return {
      success: false,
      message: "نام کسب‌وکار بیش از حد طولانی است.",
    };
  }

  if (projectTypes.length === 0) {
    return {
      success: false,
      message: "لطفاً حداقل یک نوع پروژه را انتخاب کنید.",
    };
  }

  if (!description) {
    return {
      success: false,
      message: "لطفاً توضیحات پروژه را وارد کنید.",
    };
  }

  if (description.length > 5000) {
    return {
      success: false,
      message: "توضیحات پروژه بیش از حد طولانی است.",
    };
  }

  if (!allowedContactMethods.has(contactPreference)) {
    return {
      success: false,
      message: "روش ارتباطی انتخاب‌شده معتبر نیست.",
    };
  }

  if (email.length > 160) {
    return {
      success: false,
      message: "ایمیل واردشده بیش از حد طولانی است.",
    };
  }

  return {
    success: true,
    data: {
      firstName,
      lastName,
      phone,
      email,
      businessName: personalProject ? "" : businessName,
      personalProject,
      projectTypes,
      description,
      contactPreference,
    },
  };
}