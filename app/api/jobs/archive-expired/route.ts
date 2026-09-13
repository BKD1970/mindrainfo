import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!cronSecret) {
    return NextResponse.json(
      {
        success: false,
        error:
          "CRON_SECRET is not configured.",
      },
      { status: 500 }
    );
  }

  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        success: false,
        error:
          "SUPABASE_SERVICE_ROLE_KEY is not configured.",
      },
      { status: 500 }
    );
  }

  if (!supabaseUrl) {
    return NextResponse.json(
      {
        success: false,
        error:
          "NEXT_PUBLIC_SUPABASE_URL is not configured.",
      },
      { status: 500 }
    );
  }

  const authorization =
    request.headers.get("authorization");

  if (
    authorization !==
    `Bearer ${cronSecret}`
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    const { data, error } =
      await supabase.rpc(
        "archive_expired_jobs"
      );

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Could not archive expired jobs: ${error.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: "archive-expired",
      archived:
        typeof data === "number"
          ? data
          : 0,
      timestamp:
        new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected archive error.",
      },
      { status: 500 }
    );
  }
}