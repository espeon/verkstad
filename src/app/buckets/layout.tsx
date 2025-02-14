import type { Metadata } from "next";
import Providers from "@/app/providers";
import { Figtree } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";

const poly = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
