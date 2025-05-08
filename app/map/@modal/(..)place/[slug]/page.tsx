import { PlaceType } from "@/types/place";
import { getPlace } from "@/app/place/[slug]/get-place";
import Modal from "./modal";
import PlaceScreen from "./place-screen";
import { getPlaces } from "@/app/map/get-places";

export async function generateStaticParams() {
  const places = await getPlaces();

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
