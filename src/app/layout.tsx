import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "HomeShop AI - Tư vấn đồ gia dụng",
  description: "Chatbot AI thông minh tư vấn sản phẩm gia dụng. Tìm kiếm nồi cơm, máy xay, bình đun và nhiều sản phẩm khác.",
  keywords: ["đồ gia dụng", "tư vấn AI", "mua sắm online", "nồi cơm điện", "máy xay"],
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

