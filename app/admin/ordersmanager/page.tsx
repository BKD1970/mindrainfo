import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-auth";

export default async function OrdersManagerPage() {
  const result = await requireAdminRole("orders");

  if (!result.authorized) {
    if (result.reason === "not_authenticated") {
      redirect("/admin/login?role=orders");
    }

    redirect("/admin");
  }

  return <OrdersManagerClient />;
}

async function OrdersManagerClient() {
  const { default: Client } = await import("./OrdersManagerClient");

  return <Client />;
}