import type {Metadata} from "next";
import {Inconsolata, Inter} from "next/font/google";
import "./globals.css";
import {Providers} from "@/app/providers";

const inconsolata = Inconsolata({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Roast my music taste, please!",
    description: "Because Every Music Taste Deserves a Good Burn!",
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="icon"
                  href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👀</text></svg>"/>
        </head>
        <body className={inconsolata.className}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
