import { CategoryType } from "./category";

export type PlaceType = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  photos: string[];
  category: CategoryType;
  openingHours: string[];
  slug: string;
  url: string;
};
