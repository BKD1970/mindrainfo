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

async function requireOwner(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
  }

  const accessToken = authHeader.slice("Bearer ".length).trim();

  if (!accessToken) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return { error: NextResponse.json({ error: "Invalid session" }, { status: 401 }), user: null };
  }

  const { data: adminUser, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, is_owner")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (adminError) {
    console.error("Owner verification error:", adminError);
    return { error: NextResponse.json({ error: "Failed to verify owner access" }, { status: 500 }), user: null };
  }

  if (!adminUser || adminUser.is_owner !== true) {
    return { error: NextResponse.json({ error: "Owner access required" }, { status: 403 }), user: null };
  }

  return { error: null, user: authData.user };
}

export async function POST(request: NextRequest) {
  const auth = await requireOwner(request);

  if (auth.error) {
    return auth.error;
  }

  let body: { path?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.trim() : "";

  if (!path) {
    return NextResponse.json({ error: "Proposal file path is required" }, { status: 400 });
  }

  const { data: consultation, error: consultationError } = await supabaseAdmin
    .from("business_consultation_requests")
    .select("id, proposal_file_path, proposal_file_name")
    .eq("proposal_file_path", path)
    .maybeSingle();

  if (consultationError) {
    console.error("Proposal record lookup error:", consultationError);
    return NextResponse.json({ error: "Failed to verify proposal file" }, { status: 500 });
  }

  if (!consultation || !consultation.proposal_file_path) {
    return NextResponse.json({ error: "Proposal file not found" }, { status: 404 });
  }

  const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
    .from("business-proposals")
    .createSignedUrl(consultation.proposal_file_path, 300);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    console.error("Proposal signed URL error:", signedUrlError);
    return NextResponse.json({ error: "Failed to generate proposal download link" }, { status: 500 });
  }

  return NextResponse.json({
    url: signedUrlData.signedUrl,
    fileName: consultation.proposal_file_name ?? "proposal",
  });
}