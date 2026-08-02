import { DirectorAppShell } from "@/components/director/director-app-shell";
import { getSession } from "@/lib/auth-session.server";
import { redirect } from "next/navigation";

export async function DirectorAuthenticatedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return <DirectorAppShell>{children}</DirectorAppShell>;
}
