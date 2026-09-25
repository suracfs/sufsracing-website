import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sufsracing.org"),

  title: "Sofia University Racing",
  description:
    "We are Sofia University Racing – one of the newest Formula Student teams in Europe and first EV team from Bulgaria.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Sofia University Racing",
    description:
      "We are Sofia University Racing – one of the newest Formula Student teams in Europe and first EV team from Bulgaria.",
    url: "https://sufsracing.org",
    siteName: "Sofia University Racing",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
