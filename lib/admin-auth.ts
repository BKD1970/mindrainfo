import { createSupabaseServerClient } from "@/lib/supabase-server";

export type AdminRole =
  | "owner"
  | "jobs"
  | "articles"
  | "shop"
  | "technology"
  | "orders";

const permissionMap = {
  owner: "is_owner",
  jobs: "can_manage_jobs",
  articles: "can_manage_articles",
  shop: "can_manage_shop",
  technology: "can_manage_technology",
  orders: "can_manage_orders",
} as const;

export async function requireAdminRole(role: AdminRole) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No logged-in user
  if (!user) {
    return {
      authorized: false,
      reason: "not_authenticated" as const,
    };
  }

  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select(
      "id, email, is_owner, can_manage_jobs, can_manage_articles, can_manage_shop, can_manage_technology, can_manage_orders"
    )
    .eq("id", user.id)
    .maybeSingle();

  // User is not in admin_users
  if (error || !adminUser) {
    return {
      authorized: false,
      reason: "not_admin" as const,
    };
  }

  const permission = permissionMap[role];

  // Owner has access to everything
  if (adminUser.is_owner) {
    return {
      authorized: true,
      user: adminUser,
    };
  }

  // Check the requested manager permission
  if (!adminUser[permission]) {
    return {
      authorized: false,
      reason: "insufficient_permission" as const,
    };
  }

  return {
    authorized: true,
    user: adminUser,
  };
}