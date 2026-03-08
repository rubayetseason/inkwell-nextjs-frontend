"use client";

import { motion } from "framer-motion";
import { PenLine, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

export default function Hero() {
  const { user } = useAuthStore();

  if (user) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-center mb-16 relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6"
      >
        <Sparkles className="w-3.5 h-3.5" />A home for thoughtful writers
      </motion.div>

      <h1
        className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Where <span className="text-primary italic">Stories</span>
        <br />
        Come to Life
      </h1>

      <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
        Share your ideas, follow brilliant minds, and discover writing that
        moves you. Inkwell is where words find their home.
      </p>

      <div className="flex items-center justify-center gap-4">
        <Link href="/register">
          <Button size="lg" className="gap-2 text-base font-semibold px-8">
            Start Writing <PenLine className="w-5 h-5" />
          </Button>
        </Link>

        <Link href="/login">
          <Button size="lg" variant="ghost" className="gap-2 text-base">
            Sign In <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </motion.section>
  );
}
