"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function signOut(role: string = "owner") {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  const loginUrl =
    role === "jobs"
      ? "/admin/login?role=jobs"
      : role === "articles"
        ? "/admin/login?role=articles"
        : role === "shop"
          ? "/admin/login?role=shop"
          : role === "technology"
            ? "/admin/login?role=technology"
            : role === "orders"
              ? "/admin/login?role=orders"
              : "/admin/login";

  redirect(loginUrl);
}