import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-auth";

export default async function JobsManagerPage() {
  const result = await requireAdminRole("jobs");

  if (!result.authorized) {
    if (result.reason === "not_authenticated") {
      redirect("/admin/login?role=jobs");
    }

    redirect("/admin");
  }

  return <JobsManagerClient />;
}

async function JobsManagerClient() {
  const { default: Client } = await import("./JobsManagerClient");

  return <Client />;
}