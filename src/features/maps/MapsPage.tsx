import { Page, PageHeader, Stagger, Rise } from "@/components/ui";
import { useContent } from "@/services/content";
import { useT } from "@/i18n";
import { MapCard } from "./MapCard";

export function MapsPage() {
  const { maps } = useContent();
  const t = useT();
  return (
    <Page>
      <PageHeader kicker="CS2 · Map pool" title={t("maps.title")} />
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {maps.map((m) => (
          <Rise key={m.id}>
            <MapCard map={m} />
          </Rise>
        ))}
      </Stagger>
    </Page>
  );
}
