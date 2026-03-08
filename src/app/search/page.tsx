"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, FileText, Loader2, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/user/follow-button";
import { useAuthStore } from "@/store/auth.store";
import { Heart } from "lucide-react";
import { getAvatarFallback } from "@/helpers/getAvatarFallback";
import { searchApi } from "@/services/search.services";
import { formatRelativeTime } from "@/helpers/formatRelativeTime";

type Tab = "all" | "users" | "blogs";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [results, setResults] = useState<{ users: any[]; blogs: any[] }>({
    users: [],
    blogs: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = useCallback(async (q: string, t: Tab) => {
    if (!q.trim()) {
      setResults({ users: [], blogs: [] });
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await searchApi.search(q.trim(), t);
      setResults(res.data);
    } catch {
      setResults({ users: [], blogs: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => doSearch(query, tab), 350);
    return () => clearTimeout(timer);
  }, [query, tab, doSearch]);

  const totalResults = results.users.length + results.blogs.length;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: totalResults || undefined },
    { id: "users", label: "People", count: results.users.length || undefined },
    { id: "blogs", label: "Posts", count: results.blogs.length || undefined },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 -ml-3">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Search
            </h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts and people..."
              className="w-full pl-12 pr-12 py-3.5 text-base bg-card border border-border rounded-2xl focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tabs */}
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 mt-4 bg-muted/30 rounded-xl p-1 border border-border"
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    tab === t.id
                      ? "bg-card border border-border shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                  {t.count !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-md ${tab === t.id ? "bg-primary/10 text-primary" : "bg-muted"}`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {/* No results */}
        {!isLoading && hasSearched && totalResults === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p
              className="font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No results found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try searching with different keywords
            </p>
          </motion.div>
        )}

        {/* Empty state */}
        {!hasSearched && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-sm">
              Start typing to search posts and people
            </p>
          </motion.div>
        )}

        {/* Results */}
        {!isLoading && hasSearched && totalResults > 0 && (
          <div className="space-y-6">
            {/* Users */}
            {(tab === "all" || tab === "users") && results.users.length > 0 && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {tab === "all" && (
                  <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-3">
                    <User className="w-4 h-4" />
                    People
                  </h2>
                )}
                <div className="space-y-2">
                  {results.users.map((u, i) => (
                    <motion.div
                      key={u._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
                    >
                      <Link
                        href={`/profile/${u._id}`}
                        className="flex items-center gap-3 group flex-1 min-w-0"
                      >
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarImage src={u.profilePicture} />
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {getAvatarFallback(u.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {u.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {u.followers?.length || 0} followers
                            {u.bio &&
                              ` · ${u.bio.slice(0, 40)}${u.bio.length > 40 ? "…" : ""}`}
                          </p>
                        </div>
                      </Link>
                      {user && user._id !== u._id && (
                        <FollowButton
                          userId={u._id}
                          initialIsFollowing={false}
                          size="sm"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Posts */}
            {(tab === "all" || tab === "blogs") && results.blogs.length > 0 && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {tab === "all" && (
                  <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4" />
                    Posts
                  </h2>
                )}
                <div className="space-y-3">
                  {results.blogs.map((blog, i) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/blog/${blog._id}`}
                        className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                          {blog.thumbnail ? (
                            <Image
                              src={blog.thumbnail}
                              alt={blog.title}
                              width={80}
                              height={64}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                              <span
                                className="text-2xl font-bold text-primary/30"
                                style={{ fontFamily: "var(--font-display)" }}
                              >
                                {blog.title?.[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {blog.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {blog.shortDescription}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Link
                              href={`/profile/${blog.author?._id}`}
                              className="flex items-center gap-1.5 group/author"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Avatar className="w-5 h-5">
                                <AvatarImage
                                  src={blog.author?.profilePicture}
                                />
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                  {getAvatarFallback(blog.author?.username)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground group-hover/author:text-foreground transition-colors">
                                {blog.author?.username}
                              </span>
                            </Link>
                            <span className="text-xs text-muted-foreground/50">
                              ·
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(blog.createdAt)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Heart className="w-3 h-3" />
                              {blog.likes?.length || 0}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
