import Link from "next/link";
import { Feather, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl -z-10" />

      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Feather className="w-5 h-5 text-primary-foreground" />
          </div>

          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Inkwell
          </span>
        </div>

        <h1
          className="text-6xl font-bold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </h1>

        <h2 className="text-xl font-semibold mb-2">This story doesn't exist</h2>

        <p className="text-muted-foreground mb-6">
          The page you're looking for may have been moved or never existed.
        </p>

        <Link href="/">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
