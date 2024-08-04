import type {Metadata} from "next";
import {Inconsolata, Inter} from "next/font/google";
import "./globals.css";
import {Providers} from "@/app/providers";

const inconsolata = Inconsolata({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Roast my music taste, please!",
    description: "Think you got superior music taste? Let the gods of music be the judge of it",
    openGraph: {
        title: "Roast my music taste, please!",
        images: [
            {
                url: "https://roastmymusictasteplease.vercel.app/og-image.png",
                width: 1200,
                height: 630,
                alt: "Roast my music taste, please!"
            }
        ],
        type: "website",
        url: "https://roastmymusictasteplease.vercel.app"
    },
    twitter: {
        images: [
            {
                url: "https://roastmymusictasteplease.vercel.app/og-image.png",
                alt: "Roast my music taste, please!",
                width: 1200,
                height: 630
            }
        ],
        title: "Roast my music taste, please!",
        card: "summary_large_image",
        description: "Think you got superior music taste? Let the gods of music be the judge of it"
    }
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
