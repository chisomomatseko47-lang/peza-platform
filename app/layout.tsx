import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peza — Buy. Sell. Connect. Zambia's Commerce Platform",
  description: "Peza is Zambia's WhatsApp commerce platform. Browse local shops, place orders, pay with Airtel Money. Built by Kivara.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}