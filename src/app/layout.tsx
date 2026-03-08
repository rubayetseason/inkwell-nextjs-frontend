import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { Epilogue } from "next/font/google";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Inkwell — Where Stories Live",
  description: "A beautiful blogging platform for thoughtful writers.",
  icons: {
    icon: "/favicon.ico",
  },
};

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const clashDisplay = localFont({
  variable: "--font-clash",
  src: [
    {
      path: "../assets/fonts/clash-display/ClashDisplay-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/clash-display/ClashDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/clash-display/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/clash-display/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/clash-display/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/clash-display/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${epilogue.variable} ${clashDisplay.variable} grain min-h-screen antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
