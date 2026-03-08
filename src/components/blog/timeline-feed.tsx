"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { Blog } from "@/types";
import { Button } from "@/components/ui/button";
import { BlogCard } from "./blog-card";
import { blogsApi } from "@/services/blogs.services";

interface TimelineFeedProps {
  isAuthenticated?: boolean;
}

export function TimelineFeed({ isAuthenticated }: TimelineFeedProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const fetchBlogs = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      const res = await blogsApi.getFeed(pageNum, 9);
      const data = res.data;

      setBlogs((prev) =>
        reset || pageNum === 1 ? data.blogs : [...prev, ...data.blogs],
      );
      setTotalPages(data.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(1, true);
  }, [fetchBlogs, isAuthenticated]);

  const handleLoadMore = () => {
    if (page < totalPages && !isLoadingMore) {
      fetchBlogs(page + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button
          onClick={() => fetchBlogs(1, true)}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✍️</span>
        </div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isAuthenticated ? "Your feed is empty" : "No posts yet"}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isAuthenticated
            ? "Follow some authors to see their posts here."
            : "Be the first to write a story."}
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, i) => (
          <BlogCard key={blog._id} blog={blog} index={i} />
        ))}
      </div>

      {page < totalPages && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-10"
        >
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="gap-2 px-8"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
