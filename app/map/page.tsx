import { PlaceType } from "@/types/place";
import MapScreen from "./map-screen";
import { getPlaces } from "@/lib/queries/get-places";

export default async function Map() {
  const places = (await getPlaces()) as PlaceType[];

  return <MapScreen {...{ places }} />;
}
