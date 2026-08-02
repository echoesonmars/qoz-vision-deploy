import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import type { StudentTwinData } from "@/lib/data/stubs/people/students-mock";
import { MdLocalPharmacy } from "react-icons/md";

type PeopleStudentsPrescriptionCardProps = {
  items: StudentTwinData["prescriptionItems"];
};

export function PeopleStudentsPrescriptionCard({ items }: PeopleStudentsPrescriptionCardProps) {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdLocalPharmacy
            className="mr-1 inline size-4 align-text-bottom text-primary"
            aria-hidden
          />
          Рекомендации
        </p>
        <CardTitle className="text-lg font-semibold">AI prescription</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Темы для повтора и ссылки на адаптивные ДЗ (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ol className="list-decimal space-y-3 pl-4 text-sm leading-relaxed">
          {items.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
