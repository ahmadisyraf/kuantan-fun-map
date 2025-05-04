import { PlaceType } from "@/types/place";
import { getPlace } from "@/app/place/[slug]/get-place";
import Modal from "./modal";
import PlaceScreen from "./place-screen";

export default async function Place({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = (await getPlace(slug)) as PlaceType;

  return (
    <Modal title={place.name} description={place.address}>
      <PlaceScreen {...{ place }} />
    </Modal>
  );
}
