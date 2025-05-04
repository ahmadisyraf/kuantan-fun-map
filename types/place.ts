import { CategoryType } from "./category";

export type PlaceType = {
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
