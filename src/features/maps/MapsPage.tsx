import { Page, PageHeader } from "@/components/ui";
import { useContent } from "@/services/content";
import { useT } from "@/i18n";
import { MapShelf } from "./MapShelf";

export function MapsPage() {
  const { maps } = useContent();
  const t = useT();
  return (
    <Page>
      <PageHeader kicker="CS2 · Map pool" title={t("maps.title")} />
      <MapShelf maps={maps} />
    </Page>
  );
}
