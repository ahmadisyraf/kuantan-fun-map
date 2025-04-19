import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins-font",
  weight: ["100", "200", "300", "400", "500", "600"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "Kuantan Fun Map",
  description: "Explore Kuantan with Kuantan Fun Map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
