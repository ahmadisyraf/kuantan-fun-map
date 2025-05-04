import { PlaceType } from "@/types/place";
import { getPlaces } from "./get-places";
import MapScreen from "./map-screen";

export default async function Map() {
  const places = (await getPlaces()) as PlaceType[];

  return <MapScreen {...{places}} />;
}
