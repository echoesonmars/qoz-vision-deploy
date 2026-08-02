import { DirectorAuthenticatedShell } from "@/components/director/director-authenticated-shell";
import { DirectorProviders } from "@/components/director/director-providers";

export default function PeopleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DirectorProviders>
      <DirectorAuthenticatedShell>{children}</DirectorAuthenticatedShell>
    </DirectorProviders>
  );
}
