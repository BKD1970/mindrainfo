import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-auth";
import ArticlesManagerClient from "./ArticlesManagerClient";

export default async function ArticlesManagerPage() {
  const result = await requireAdminRole("articles");

  if (!result.authorized) {
    if (result.reason === "not_authenticated") {
      redirect("/admin/login?role=articles");
    }

    redirect("/admin");
  }

  return <ArticlesManagerClient />;
}