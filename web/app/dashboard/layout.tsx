import { DashboardAppShellRouter } from "@/components/dashboard-app-shell-router";
import { DirectorProviders } from "@/components/director/director-providers";
import { CamerasProvider } from "@/lib/cameras/cameras-context";
import { getSession } from "@/lib/auth-session.server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const user = {
    name: session.email.split("@")[0] ?? session.email,
    email: session.email,
  };

  return (
    <DirectorProviders>
      <CamerasProvider>
        <DashboardAppShellRouter user={user}>{children}</DashboardAppShellRouter>
      </CamerasProvider>
    </DirectorProviders>
  );
}
