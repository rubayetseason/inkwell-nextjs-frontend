"use client";

import { motion } from "framer-motion";
import {
  PenLine,
  ArrowRight,
  Sparkles,
  Brain,
  ListTodo,
  Wand2,
} from "lucide-react";
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
      className="text-center mb-20 relative"
    >
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-primary/10 rounded-full blur-3xl -z-10" />

      {/* AI Badge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6"
      >
        <Sparkles className="w-3.5 h-3.5" />
        AI-powered writing platform
      </motion.div>

      {/* Header */}
      <h1
        className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Where <span className="text-primary italic">AI</span> Helps
        <br />
        Stories Come to Life
      </h1>

      {/* Description */}
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
        Write, explore, and think better with AI. Instantly generate{" "}
        <span className="mt-4 inline-flex items-center px-3 bg-white text-black font-medium rounded-full">
          TL;DR summaries
        </span>
        , ask AI to{" "}
        <span className="mt-4 inline-flex items-center px-3 bg-white text-black font-medium rounded-full">
          explain or expand posts
        </span>
        , and even manage your workflow with{" "}
        <span className="mt-4 inline-flex items-center px-3 bg-white text-black font-medium rounded-full">
          AI-powered Kanban agents
        </span>
        .
      </p>

      {/* AI Features */}
      <div className="relative flex flex-wrap justify-center gap-3 mb-10">
        {/* Orange Neon Glow */}
        <div className="absolute inset-0 flex justify-center -z-10">
          <motion.div
            className="absolute inset-0 flex justify-center -z-10"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-[420px] h-[120px] bg-orange-500/20 blur-3xl rounded-full" />
          </motion.div>
        </div>

        <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-orange-500/50 bg-muted/40 backdrop-blur-sm">
          <Brain className="w-4 h-4 text-primary" />
          AI TL;DR summaries
        </div>

        <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-orange-500/50 bg-muted/40 backdrop-blur-sm">
          <Wand2 className="w-4 h-4 text-primary" />
          Explain & expand posts
        </div>

        <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-orange-500/50 bg-muted/40 backdrop-blur-sm">
          <ListTodo className="w-4 h-4 text-primary" />
          Agentic Kanban workflow
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center gap-4">
        <Link href="/register">
          <Button size="lg" className="gap-2 text-base font-semibold px-8">
            Start Writing
            <PenLine className="w-5 h-5" />
          </Button>
        </Link>

        <Link href="/login">
          <Button size="lg" variant="ghost" className="gap-2 text-base">
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </motion.section>
  );
}
