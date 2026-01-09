import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // <--- Import Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soto Betawi - Lowongan Kerja Part-time",
  description: "Aplikasi pencari kerja part-time UMKM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar /> {/* <--- Pasang Navbar Disini */}
        
        <main>
            {children}
        </main>
      </body>
    </html>
  );
}