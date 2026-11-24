import { Page, PageHeader } from "@/components/ui";
import { useContent } from "@/services/content";
import { MapCard } from "./MapCard";

export function MapsPage() {
  const { maps } = useContent();
  return (
    <Page>
      <PageHeader title="Карты" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {maps.map((m) => (
          <MapCard key={m.id} map={m} />
        ))}
      </div>
    </Page>
  );
}
