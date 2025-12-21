import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import "./globals.css";

const sfPro = localFont({
  src: "../../public/fonts/SF-Pro-Display-Heavy.ttf",
  display: "swap",
  variable: "--font-sf-pro",
});

export const metadata: Metadata = {
  title: "HieuNghiGPT - Your AI Coding Teammate",
  description: "AI-powered coding assistant built with LangGraph. Ask anything about code, debugging, architecture - get instant answers. Free 10K tokens/day.",
  keywords: ["AI chatbot", "LangGraph", "GPT", "coding assistant", "HieuNghiGPT"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sfPro.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

