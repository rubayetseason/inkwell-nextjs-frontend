"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { aiApi } from "@/services/ai.services";
import { useAuthStore } from "@/store/auth.store";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronRight, Sparkles, X, Zap } from "lucide-react";
import { useState } from "react";

interface AIInsightButtonProps {
  blogId: string;
  title: string;
  content: string;
}

type Mode = "tldr" | "tell_more";

export function AIInsightButton({
  blogId,
  title,
  content,
}: AIInsightButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleAnalyze = async (selectedMode: Mode) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use AI features.",
        variant: "destructive",
      });
      return;
    }
    setMode(selectedMode);
    setResult("");
    setIsLoading(true);
    try {
      const res = await aiApi.analyzeBlog(content, title, selectedMode);
      setResult(res.data.result);
    } catch (err: any) {
      toast({
        title: "AI error",
        description: err?.response?.data?.message || "Failed to analyze blog.",
        variant: "destructive",
      });
      setMode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMode(null);
      setResult("");
    }, 300);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 border border-primary/30 hover:border-primary/50 rounded-xl text-primary text-sm font-medium transition-all"
      >
        <Sparkles className="w-4 h-4" />
        AI Insights
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />

            {/* Modal Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">AI Insights</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-[240px]">
                        {title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mode selection */}
                {!mode && !isLoading && (
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose how you'd like to explore this post:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnalyze("tldr")}
                        className="flex flex-col items-start gap-3 p-4 bg-muted/40 hover:bg-primary/10 border border-border hover:border-primary/40 rounded-xl transition-all group text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                          <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">TL;DR</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Quick summary in bullet points
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors self-end" />
                      </motion.button>

                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnalyze("tell_more")}
                        className="flex flex-col items-start gap-3 p-4 bg-muted/40 hover:bg-primary/10 border border-border hover:border-primary/40 rounded-xl transition-all group text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Tell More</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Deeper context & insights
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors self-end" />
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {mode === "tldr"
                          ? "Summarizing..."
                          : "Analyzing deeper..."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        AI is reading your post
                      </p>
                    </div>
                  </div>
                )}

                {/* Result */}
                {result && !isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="px-5 pb-2 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        {mode === "tldr" ? (
                          <>
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold">
                              TL;DR Summary
                            </span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold">
                              Deeper Insights
                            </span>
                          </>
                        )}
                      </div>
                      <div className="bg-muted/40 rounded-xl p-4 max-h-64 overflow-y-auto">
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                          {result}
                        </p>
                      </div>
                    </div>

                    {/* Try other mode */}
                    <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border">
                      <button
                        onClick={() => {
                          setMode(null);
                          setResult("");
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ← Back to options
                      </button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleAnalyze(mode === "tldr" ? "tell_more" : "tldr")
                        }
                        className="text-xs gap-1.5 h-8"
                      >
                        <Sparkles className="w-3 h-3" />
                        {mode === "tldr" ? "Tell More" : "TL;DR Instead"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
