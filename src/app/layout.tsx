import "$src/app/styles/globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "./components/ui/toaster";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata = {
    title: "Algo Address Tracker",
    description: "Track Algorand testnet wallet balances in real time",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`font-sans ${inter.variable}`}>
                <Toaster />
                {children}
            </body>
        </html>
    );
}
