import { PT_Sans, Bungee } from "next/font/google";
import "./globals.css";
import { Providers } from "./redux-provider";
import "antd/dist/antd.min.css";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

const bungee = Bungee({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bungee",
});

export const metadata = {
  title: "next starter kit",
  description: "$AMP (Algorithmic Monetary Policy)",
  icons: {
    icon: [{ url: "/favicon/favicon.png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ptSans.className} ${bungee.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
