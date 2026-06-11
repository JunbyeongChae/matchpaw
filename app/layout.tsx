import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "matchpaw — 유기동물 입양 AI 매칭",
  description: "라이프스타일 설문으로 나에게 맞는 유기동물을 추천받으세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
