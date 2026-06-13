import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Zivlo | B2B Lead Generation for UK Businesses",
  description:
    "Stop prospecting. Start closing. Zivlo finds sourced from Companies House UK businesses that fit your service and writes a personalised pitch for each one.",
  keywords: [
    "web design leads",
    "UK B2B leads",
    "lead generation",
    "web design clients",
    "Zivlo",
  ],
  openGraph: {
    title: "Zivlo | Find your next customer",
    description:
      "Tell us the type of business you want as a client and where in the UK. Zivlo finds real companies and writes a ready-to-send pitch for each one..",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-navy">
        {children}
      </body>
    </html>
  );
}
