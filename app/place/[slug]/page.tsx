import { PlaceType } from "@/types/place";
import { getPlace } from "./get-place";
import PlaceScreen from "./place-screen";

export default async function Place({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = (await getPlace(slug)) as PlaceType;

  return <PlaceScreen {...{ place }} />;
}
