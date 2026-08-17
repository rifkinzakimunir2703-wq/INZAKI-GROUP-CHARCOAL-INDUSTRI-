import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Manajemen Arang",
  description: "Pencatatan produksi, stok, transaksi dan laba rugi industri arang"
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="id"><body>{children}</body></html>;
}