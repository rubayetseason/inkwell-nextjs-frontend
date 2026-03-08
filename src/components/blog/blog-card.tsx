"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ThumbsDown, Clock, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Blog } from "@/types";
import { getAvatarFallback } from "@/helpers/getAvatarFallback";
import { formatRelativeTime } from "@/helpers/formatRelativeTime";

interface BlogCardProps {
  blog: Blog;
  index?: number;
}

export function BlogCard({ blog, index = 0 }: BlogCardProps) {
  const readingTime = Math.ceil(
    blog.content?.replace(/<[^>]*>/g, "").split(" ").length / 200,
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Thumbnail */}
      <Link href={`/blog/${blog._id}`}>
        <div className="relative h-48 bg-muted overflow-hidden">
          {blog.thumbnail ? (
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-secondary flex items-center justify-center">
              <span
                className="text-5xl font-bold text-primary/30 select-none"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                {blog.title?.[0]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      <div className="p-5">
        {/* Author */}
        <Link
          href={`/profile/${blog.author?._id}`}
          className="flex items-center gap-2 mb-3 group/author"
        >
          <Avatar className="w-7 h-7">
            <AvatarImage src={blog.author?.profilePicture} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {getAvatarFallback(blog.author?.username)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-muted-foreground group-hover/author:text-foreground transition-colors">
            {blog.author?.username}
          </span>
          <span className="text-xs text-muted-foreground/50 ml-auto">
            {formatRelativeTime(blog.createdAt)}
          </span>
        </Link>

        {/* Title & Description */}
        <Link href={`/blog/${blog._id}`}>
          <h2
            className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {blog.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {blog.shortDescription}
          </p>
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {blog.likes?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsDown className="w-3.5 h-3.5" />
              {blog.dislikes?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readingTime}m read
            </span>
          </div>
          <Link
            href={`/blog/${blog._id}`}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:gap-2 transition-all"
          >
            Read <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
