import { PlaceType } from "@/types/place";
import Modal from "./modal";
import PlaceScreen from "./place-screen";
import { getPlaces } from "@/lib/queries/get-places";
import { getPlace } from "@/lib/queries/get-place";

export async function generateStaticParams() {
  const places = (await getPlaces()) as PlaceType[];

  return places.map((place) => ({
    slug: place.slug,
  }));
}

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
