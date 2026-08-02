import { DirectorProviders } from "@/components/director/director-providers";

export default function DirectorDrilldownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DirectorProviders>{children}</DirectorProviders>;
}
