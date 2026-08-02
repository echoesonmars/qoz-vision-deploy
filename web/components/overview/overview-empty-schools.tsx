import { DirectorSection } from "@/components/director/shared/director-section";

type OverviewEmptySchoolsProps = {
  id: string;
  title: string;
  description: string;
};

export function OverviewEmptySchools({ id, title, description }: OverviewEmptySchoolsProps) {
  return (
    <DirectorSection id={id} kicker="Школы" title={title}>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </DirectorSection>
  );
}
