import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "voin",
  description: "Created by ojefersoncode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
