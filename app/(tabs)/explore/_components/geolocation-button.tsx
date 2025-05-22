import { IconButton } from "@/components/ui/icon-button";
import { customToast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";
import { LocateFixed } from "lucide-react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface GeolocationButtonProps {
  userLocation: Coordinates | null | undefined;
  setUserLocation: (coordinates: Coordinates) => void;
}

export default function GeolocationButton({
  userLocation,
  setUserLocation,
}: GeolocationButtonProps) {
  return (
    <IconButton
      className={cn(
        "pointer-events-auto w-fit",
        userLocation !== null && "bg-primary"
      )}
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (geo) => {
            console.log(
              `latitude: ${geo.coords.latitude}, longitude: ${geo.coords.longitude}`
            );
            setUserLocation({
              lat: geo.coords.latitude,
              lng: geo.coords.longitude,
            });
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              customToast({
                status: "error",
                title: "Please allow share location in your browser settings",
              });
            } else if (err.POSITION_UNAVAILABLE) {
              customToast({
                status: "error",
                title: "Unable to find your location",
              });
            } else {
              console.error(err.message);
            }
          },
          { enableHighAccuracy: true }
        );
      }}
    >
      <LocateFixed size={18} />
    </IconButton>
  );
}
