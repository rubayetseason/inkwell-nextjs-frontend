import { Navbar } from "@/components/layout/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inkwell — Where Stories Live",
  description: "A beautiful blogging platform for thoughtful writers.",
};


export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <Navbar />
      </div>
      {children}
    </>
  );
}
