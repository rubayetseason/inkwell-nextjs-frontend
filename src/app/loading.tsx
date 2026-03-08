"use client";

import { motion } from "framer-motion";
import { Feather } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col items-center gap-6">
        {/* Logo spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center"
        >
          <Feather className="w-6 h-6 text-primary-foreground" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
          className="text-muted-foreground"
        >
          Loading stories...
        </motion.p>
      </div>
    </div>
  );
}
