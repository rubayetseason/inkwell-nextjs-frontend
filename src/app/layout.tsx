import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Inkwell — Where Stories Live",
  description: "A beautiful blogging platform for thoughtful writers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="grain min-h-screen antialiased">{children}</body>
    </html>
  );
}
