"use client";

import { Scanner } from "@yudiel/react-qr-scanner";

export default function QrCodeScreen() {
  return <Scanner onScan={(result) => console.log(result)} />;
}
