import { CategoryType } from "@/types/category";

export function getMarkerIcon(categoryType: CategoryType) {
  if (categoryType === "Beach") {
    return "/icons/beach.png";
  } else if (categoryType === "Museum") {
    return "/icons/museum.png";
  } else if (categoryType === "Mosque") {
    return "/icons/mosque.png";
  } else if (categoryType === "Park") {
    return "/icons/park.png";
  } else if (categoryType === "Mall") {
    return "/icons/mall.png";
  } else if (categoryType === "Castle") {
    return "/icons/castle.png";
  } else if (categoryType === "Landmark") {
    return "/icons/landmark.png";
  } else if (categoryType === "Zoo") {
    return "/icons/zoo.png";
  } else if (categoryType === "Riverfront") {
    return "/icons/riverfront.png";
  } else if (categoryType === "Cafe") {
    return "/icons/cafe.png";
  } else {
    return "/icons/unknown.png";
  }
}
