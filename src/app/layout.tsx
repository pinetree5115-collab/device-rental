import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers";
import { Navbar } from "@/components/common/Navbar";

export const metadata: Metadata = {
    title: "Device Rental",
    description: "기기 대여 서비스",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
            <body>
                <Providers>
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
