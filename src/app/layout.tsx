import "material-symbols";
import "remixicon/fonts/remixicon.css";
import "react-calendar/dist/Calendar.css";
import "swiper/css";
import "swiper/css/bundle";

// globals
import "./globals.css";

import LayoutProvider from "@/providers/LayoutProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});
  
export const metadata: Metadata = {
  title: "11F OS - Operating System",
  description: "11F Operating System - Professional Web-Based Operating System with CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${inter.variable} antialiased`}
      >
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
