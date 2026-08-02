import { DirectorAuthenticatedShell } from "@/components/director/director-authenticated-shell";
import { DirectorProviders } from "@/components/director/director-providers";

export default function ChecksLayout({
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
