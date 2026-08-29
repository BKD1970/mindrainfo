import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-auth";

export default async function ShopManagerPage() {
  const result = await requireAdminRole("shop");

  if (!result.authorized) {
    if (result.reason === "not_authenticated") {
      redirect("/admin/login?role=shop");
    }

    redirect("/admin");
  }

  const { default: ShopManagerClient } = await import(
    "./ShopManagerClient"
  );

  return <ShopManagerClient />;
}