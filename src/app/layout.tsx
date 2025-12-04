import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "급여명세서 - 힘이 나는 커피생활",
  description: "직원 급여명세서 조회",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased font-[Pretendard,-apple-system,Roboto,Helvetica,sans-serif] bg-neutral-100 dark:bg-neutral-900">
        {children}
      </body>
    </html>
  );
}
