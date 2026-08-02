import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { classCameraBindings } from "@/lib/data/stubs/people/classes-mock";
import { MdVideocam } from "react-icons/md";

export function PeopleClassesCameraCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdVideocam className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Камеры
        </p>
        <CardTitle className="text-lg font-semibold">Кабинет и видеоаналитика</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Привязка WebSocket-камер к слотам расписания (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Кабинет</TableHead>
              <TableHead>Камера</TableHead>
              <TableHead>Класс</TableHead>
              <TableHead>Слот</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classCameraBindings.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.room}</TableCell>
                <TableCell>{row.cameraId}</TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{row.slot}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
