import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const ALLOWED_STATUSES = ["new", "contacted", "in_progress", "completed", "closed"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

async function requireOwner(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  const accessToken = authHeader.slice("Bearer ".length).trim();

  if (!accessToken) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return {
      error: NextResponse.json({ error: "Invalid session" }, { status: 401 }),
      user: null,
    };
  }

  const { data: adminUser, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, is_owner")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (adminError) {
    console.error("Owner verification error:", adminError);

    return {
      error: NextResponse.json({ error: "Failed to verify owner access" }, { status: 500 }),
      user: null,
    };
  }

  if (!adminUser || adminUser.is_owner !== true) {
    return {
      error: NextResponse.json({ error: "Owner access required" }, { status: 403 }),
      user: null,
    };
  }

  return {
    error: null,
    user: authData.user,
  };
}

const REQUEST_SELECT = `
  id,
  created_at,
  full_name,
  email,
  phone,
  city_location,
  business_type,
  estimated_budget,
  business_stage,
  business_idea,
  help_needed,
  additional_information,
  consent,
  proposal_file_path,
  proposal_file_name,
  proposal_file_size,
  proposal_file_type,
  status
`;

export async function GET(request: NextRequest) {
  const auth = await requireOwner(request);

  if (auth.error) {
    return auth.error;
  }

  const { data, error } = await supabaseAdmin
    .from("business_consultation_requests")
    .select(REQUEST_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Consultation request fetch error:", error);

    return NextResponse.json(
      { error: "Failed to load consultation requests" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    requests: data ?? [],
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireOwner(request);

  if (auth.error) {
    return auth.error;
  }

  let body: {
    id?: string | number;
    status?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  let id: string | number = "";

  if (typeof body.id === "number") {
    if (!Number.isFinite(body.id)) {
      return NextResponse.json(
        { error: "Invalid Request ID" },
        { status: 400 }
      );
    }

    id = body.id;
  } else if (typeof body.id === "string") {
    id = body.id.trim();
  }

  const status = typeof body.status === "string" ? body.status.trim() : "";

  if (id === "") {
    return NextResponse.json(
      { error: "Request ID is required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_STATUSES.includes(status as AllowedStatus)) {
    return NextResponse.json(
      {
        error: "Invalid status",
        allowedStatuses: ALLOWED_STATUSES,
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("business_consultation_requests")
    .update({
      status: status as AllowedStatus,
    })
    .eq("id", id)
    .select(REQUEST_SELECT)
    .maybeSingle();

  if (error) {
    console.error("Consultation request status update error:", error);

    return NextResponse.json(
      { error: "Failed to update request status" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Consultation request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    request: data,
  });
}