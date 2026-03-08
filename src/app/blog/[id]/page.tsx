"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Blog } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth.store";
import { blogsApi } from "@/services/blogs.services";
import { getAvatarFallback } from "@/helpers/getAvatarFallback";
import { formatDate } from "@/helpers/formatRelativeTime";
import { FollowButton } from "@/components/user/follow-button";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogsApi.getById(id);
        setBlog(res.data);
      } catch {
        toast({
          title: "Not found",
          description: "Blog post not found.",
          variant: "destructive",
        });
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await blogsApi.delete(id);
      toast({ title: "Deleted", description: "Your post has been deleted." });
      router.push("/");
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  const isAuthor = user && blog?.author?._id === user._id;
  const isFollowingAuthor =
    user && blog
      ? (blog.author?.followers as any[])?.some(
          (f) => (typeof f === "string" ? f : f._id) === user._id,
        )
      : false;

  const readingTime = blog
    ? Math.ceil(blog.content?.replace(/<[^>]*>/g, "").split(" ").length / 200)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 -ml-3">
              <ArrowLeft className="w-4 h-4" />
              Back to Feed
            </Button>
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <Link
              href={`/profile/${blog.author?._id}`}
              className="flex items-center gap-3 group"
            >
              <Avatar className="w-11 h-11 ring-2 ring-primary/20">
                <AvatarImage src={blog.author?.profilePicture} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {getAvatarFallback(blog.author?.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {blog.author?.username}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(blog.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {!isAuthor && (
                <FollowButton
                  userId={blog.author?._id}
                  initialIsFollowing={!!isFollowingAuthor}
                  size="sm"
                />
              )}
              {isAuthor && (
                <>
                  <Link href={`/blog/${blog._id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          {blog.thumbnail && (
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-10 bg-muted">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Short Description */}
          <p className="text-lg text-muted-foreground italic mb-8 leading-relaxed border-l-4 border-primary/40 pl-4">
            {blog.shortDescription}
          </p>

          {/* Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Interactions */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium mb-1">
                  Did you enjoy this story?
                </p>
                <p className="text-xs text-muted-foreground">
                  Share your reaction below
                </p>
              </div>
              {/* <div className="flex items-center gap-3">
                <AIInsightButton />
                <LikeDislikeButtons
                  blog={blog}
                  onUpdate={setBlog}
                  size="lg"
                />
              </div> */}
            </div>
          </div>

          {/* Author bio card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 p-6 bg-card border border-border rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <Link href={`/profile/${blog.author?._id}`}>
                <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                  <AvatarImage src={blog.author?.profilePicture} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {getAvatarFallback(blog.author?.username)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Link href={`/profile/${blog.author?._id}`}>
                      <p className="font-semibold hover:text-primary transition-colors">
                        {blog.author?.username}
                      </p>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {(blog.author?.followers as any[])?.length || 0} followers
                    </p>
                  </div>
                  {!isAuthor && (
                    <FollowButton
                      userId={blog.author?._id}
                      initialIsFollowing={!!isFollowingAuthor}
                      size="sm"
                    />
                  )}
                </div>
                {blog.author?.bio && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {blog.author.bio}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.article>
      </main>
    </div>
  );
}
