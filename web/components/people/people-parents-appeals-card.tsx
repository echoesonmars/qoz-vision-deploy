import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { appealChatLines, appealThreads } from "@/lib/data/stubs/people/parents-mock";
import { MdForum } from "react-icons/md";

function statusRu(s: (typeof appealThreads)[0]["status"]) {
  if (s === "open") return "открыто";
  if (s === "review") return "на проверке";
  return "закрыто";
}

export function PeopleParentsAppealsCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdForum className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Обратная связь
        </p>
        <CardTitle className="text-lg font-semibold">Апелляции и сообщения</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Запросы родителей и переписка (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-0 lg:grid-cols-2">
        <ScrollArea className="h-52 rounded-xl border border-border/60">
          <ul className="space-y-2 p-3">
            {appealThreads.map((t) => (
              <li key={t.id} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <p className="text-sm font-medium leading-snug">{t.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {statusRu(t.status)}
                  </Badge>
                  <span className="text-muted-foreground text-xs">{t.updatedAt}</span>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <ScrollArea className="h-52 rounded-xl border border-border/60">
          <ul className="space-y-3 p-3">
            {appealChatLines.map((m) => (
              <li key={m.id} className="text-sm">
                <span className="font-semibold">{m.author}</span>
                <span className="text-muted-foreground ml-2 text-xs">{m.at}</span>
                <p className="text-muted-foreground mt-1 leading-relaxed">{m.body}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
