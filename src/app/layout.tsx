import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "HieuNghiGPT - AI Chatbot thế hệ mới",
  description: "Trợ lý AI thông minh với công nghệ LangGraph tiên tiến. Tư vấn sản phẩm, trò chuyện tự nhiên, hoàn toàn miễn phí.",
  keywords: ["AI chatbot", "LangGraph", "GPT", "tư vấn AI", "HieuNghiGPT"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

