import { CategoryType } from "@/types/category";
import AddPlaceScreen from "./add-place-screen";

export default async function AddPlace({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const categoryParam = (await searchParams).category as
    | CategoryType
    | undefined;

  return <AddPlaceScreen {...{ categoryParam }} />;
}
