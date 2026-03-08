"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

export default function FeedHeader({ user }: { user: User | null }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {user ? "Your Feed" : "Latest Stories"}
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          {user
            ? "Posts from authors you follow"
            : "Discover stories from our community"}
        </p>
      </motion.div>

      {user && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/create-blog">
            <Button size="sm" className="gap-2">
              <PenLine className="w-4 h-4" />
              New Post
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}