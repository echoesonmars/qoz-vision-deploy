import { AiAgentChatWidget } from "@/components/ai-agent/ai-agent-chat-widget";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export type AppShellUser = {
  name: string;
  email: string;
};

export function AuthenticatedAppShell({
  user,
  children,
}: {
  user: AppShellUser;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>{children}</SidebarInset>
      <AiAgentChatWidget />
    </SidebarProvider>
  );
}
