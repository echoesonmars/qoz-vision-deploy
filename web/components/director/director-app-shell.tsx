import { AiAgentChatWidget } from "@/components/ai-agent/ai-agent-chat-widget";
import { ADM_COPY } from "@/lib/brand/copy";

export function DirectorAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
        {ADM_COPY.footerCredit}
      </footer>
      <AiAgentChatWidget />
    </div>
  );
}
