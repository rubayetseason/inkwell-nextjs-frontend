import { Navbar } from "@/components/layout/navbar";

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
