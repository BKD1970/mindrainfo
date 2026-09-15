import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET_NAME = "business-proposals";
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
]);

const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "zip",
]);

const BUSINESS_TYPES = new Set([
  "Startup",
  "Retail",
  "E-commerce",
  "Service Business",
  "Technology / Software",
  "Manufacturing",
  "Food & Restaurant",
  "Education",
  "Consulting",
  "Other",
]);

const BUSINESS_STAGES = new Set([
  "Just an idea",
  "Planning",
  "Already operating",
  "Need to improve existing business",
  "Ready to launch",
]);

const HELP_OPTIONS = new Set([
  "Business Planning",
  "Market Research",
  "Website",
  "Mobile App",
  "E-commerce",
  "Digital Marketing",
  "Branding",
  "Automation",
  "Technology",
  "Data / Analytics",
  "Business Strategy",
  "Other",
]);

type ConsultationRequest = {
  full_name?: unknown;
  email?: unknown;
  phone?: unknown;
  city_location?: unknown;
  business_type?: unknown;
  estimated_budget?: unknown;
  business_stage?: unknown;
  business_idea?: unknown;
  help_needed?: unknown;
  additional_information?: unknown;
  consent?: unknown;

  proposal_file_path?: unknown;
  proposal_file_name?: unknown;
  proposal_file_size?: unknown;
  proposal_file_type?: unknown;
};

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");

  return parts.length > 1
    ? parts[parts.length - 1]
    : "";
}

function validateProposal(
  fileName: string,
  fileSize: number,
  fileType: string
): string | null {
  if (!fileName) {
    return "Project proposal file name is missing.";
  }

  if (fileSize <= 0) {
    return "The selected project proposal file is empty.";
  }

  if (fileSize > MAX_FILE_SIZE) {
    return "Project proposal must be 20 MB or smaller.";
  }

  const extension = getFileExtension(fileName);

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return "Only PDF, DOC, DOCX or ZIP files are allowed.";
  }

  if (!ALLOWED_FILE_TYPES.has(fileType)) {
    return "The selected project proposal file type is not allowed.";
  }

  return null;
}

function validateHelpNeeded(value: string): boolean {
  const selected = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (selected.length === 0) {
    return false;
  }

  return selected.every((item) => HELP_OPTIONS.has(item));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    /*
     * ---------------------------------------------------------
     * ACTION 1: Create secure upload URL
     * ---------------------------------------------------------
     */
    if (body?.action === "create-upload-url") {
      const fileName = cleanText(body?.file_name);
      const fileType = cleanText(body?.file_type);

      const numericSize =
        typeof body?.file_size === "number"
          ? body.file_size
          : Number(body?.file_size);

      if (
        !fileName ||
        !Number.isFinite(numericSize) ||
        !fileType
      ) {
        return NextResponse.json(
          {
            error:
              "Project proposal file information is incomplete.",
          },
          { status: 400 }
        );
      }

      const fileError = validateProposal(
        fileName,
        numericSize,
        fileType
      );

      if (fileError) {
        return NextResponse.json(
          { error: fileError },
          { status: 400 }
        );
      }

      const extension = getFileExtension(fileName);

      const storagePath =
        `requests/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;

      const supabase = getAdminSupabase();

      const {
        data,
        error,
      } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUploadUrl(storagePath);

      if (error || !data) {
        console.error(
          "Create proposal upload URL error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Unable to prepare the proposal upload.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        path: storagePath,
        token: data.token,
      });
    }

    /*
     * ---------------------------------------------------------
     * ACTION 2: Delete uploaded proposal if submission fails
     * ---------------------------------------------------------
     */
    if (body?.action === "delete-upload") {
      const path = cleanText(body?.path);

      if (!path) {
        return NextResponse.json(
          { error: "Upload path is missing." },
          { status: 400 }
        );
      }

      if (!path.startsWith("requests/")) {
        return NextResponse.json(
          { error: "Invalid upload path." },
          { status: 400 }
        );
      }

      const supabase = getAdminSupabase();

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

      if (error) {
        console.error(
          "Delete proposal upload error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Unable to remove the uploaded proposal.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * ---------------------------------------------------------
     * ACTION 3: Save consultation request
     * ---------------------------------------------------------
     */

    const fullName = cleanText(body.full_name);
    const email = cleanText(body.email);
    const phone = cleanText(body.phone);
    const cityLocation = cleanText(body.city_location);
    const businessType = cleanText(body.business_type);
    const estimatedBudget = cleanText(
      body.estimated_budget
    );
    const businessStage = cleanText(body.business_stage);
    const businessIdea = cleanText(body.business_idea);
    const helpNeeded = cleanText(body.help_needed);
    const additionalInformation = cleanText(
      body.additional_information
    );

    const proposalFilePath = cleanText(
      body.proposal_file_path
    );
    const proposalFileName = cleanText(
      body.proposal_file_name
    );
    const proposalFileType = cleanText(
      body.proposal_file_type
    );

    const proposalFileSize =
      body.proposal_file_size === null ||
      body.proposal_file_size === undefined
        ? null
        : Number(body.proposal_file_size);

    const consent = body.consent === true;

    if (!fullName) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (fullName.length > 120) {
      return NextResponse.json(
        { error: "Full name is too long." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (phone.length > 40) {
      return NextResponse.json(
        { error: "Phone number is too long." },
        { status: 400 }
      );
    }

    if (
      !businessType ||
      !BUSINESS_TYPES.has(businessType)
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a valid business type.",
        },
        { status: 400 }
      );
    }

    if (
      !businessStage ||
      !BUSINESS_STAGES.has(businessStage)
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a valid business stage.",
        },
        { status: 400 }
      );
    }

    if (!businessIdea) {
      return NextResponse.json(
        {
          error:
            "Business idea / description is required.",
        },
        { status: 400 }
      );
    }

    if (businessIdea.length > 5000) {
      return NextResponse.json(
        {
          error:
            "Business idea / description is too long.",
        },
        { status: 400 }
      );
    }

    if (!validateHelpNeeded(helpNeeded)) {
      return NextResponse.json(
        {
          error:
            "Please select valid help options.",
        },
        { status: 400 }
      );
    }

    if (estimatedBudget.length > 200) {
      return NextResponse.json(
        {
          error: "Estimated budget is too long.",
        },
        { status: 400 }
      );
    }

    if (cityLocation.length > 200) {
      return NextResponse.json(
        {
          error: "City / location is too long.",
        },
        { status: 400 }
      );
    }

    if (additionalInformation.length > 5000) {
      return NextResponse.json(
        {
          error:
            "Additional information is too long.",
        },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        {
          error:
            "Consent is required before submitting the request.",
        },
        { status: 400 }
      );
    }

    /*
     * Optional proposal validation
     */
    if (proposalFilePath) {
      if (!proposalFileName) {
        return NextResponse.json(
          {
            error:
              "Proposal file name is missing.",
          },
          { status: 400 }
        );
      }

      if (
        !Number.isFinite(proposalFileSize) ||
        proposalFileSize === null ||
        proposalFileSize <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Proposal file size is invalid.",
          },
          { status: 400 }
        );
      }

      const proposalError = validateProposal(
        proposalFileName,
        proposalFileSize,
        proposalFileType
      );

      if (proposalError) {
        return NextResponse.json(
          { error: proposalError },
          { status: 400 }
        );
      }

      if (!proposalFilePath.startsWith("requests/")) {
        return NextResponse.json(
          {
            error:
              "Invalid proposal file path.",
          },
          { status: 400 }
        );
      }
    }

    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("business_consultation_requests")
      .insert({
        full_name: fullName,
        email,
        phone,
        city_location:
          cityLocation || null,
        business_type: businessType,
        estimated_budget:
          estimatedBudget || null,
        business_stage: businessStage,
        business_idea: businessIdea,
        help_needed: helpNeeded,
        additional_information:
          additionalInformation || null,
        consent: true,

        proposal_file_path:
          proposalFilePath || null,
        proposal_file_name:
          proposalFileName || null,
        proposal_file_size:
          proposalFilePath
            ? proposalFileSize
            : null,
        proposal_file_type:
          proposalFileType || null,

        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error(
        "Business consultation insert error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "We could not save your consultation request. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        request_id: data?.id ?? null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Business consultation API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while submitting your request.",
      },
      { status: 500 }
    );
  }
}
