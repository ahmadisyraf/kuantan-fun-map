"use client";

import { Button } from "@/components/ui/button";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function QrCodeScreen() {
  return <Scanner onScan={(result) => console.log(result)} />;
}
