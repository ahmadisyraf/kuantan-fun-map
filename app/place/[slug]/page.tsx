import { PlaceType } from "@/types/place";
import { getPlace } from "./get-place";
import PlaceScreen from "./place-screen";
import { getPlaces } from "./get-places";

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

  return <PlaceScreen {...{ place }} />;
}
