import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-auth";

export default async function TechnologyTopicsManagerPage() {
  const result = await requireAdminRole("technology");

  if (!result.authorized) {
    if (result.reason === "not_authenticated") {
      redirect("/admin/login?role=technology");
    }

    redirect("/admin");
  }

  async function TechnologyTopicsManagerClient() {
    const { default: Client } = await import(
      "./TechnologyTopicsManagerClient"
    );

    return <Client />;
  }

  return <TechnologyTopicsManagerClient />;
}
