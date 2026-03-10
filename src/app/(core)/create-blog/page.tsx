"use client";

import { BlogEditor } from "@/components/blog/blog-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { blogsApi } from "@/services/blogs.services";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import { ArrowLeft, ImageIcon, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateBlogPage() {
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    content: "",
    thumbnail: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: isLoadingUser } = useAuthStore();

  useEffect(() => {
    if (isLoadingUser) return;
    if (!user) {
      router.push("/login");
    }
  }, [user, isLoadingUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title for your post.",
        variant: "destructive",
      });
      return;
    }
    if (!form.shortDescription.trim()) {
      toast({
        title: "Description required",
        description: "Please add a short description.",
        variant: "destructive",
      });
      return;
    }
    if (!form.content || form.content === "<p></p>") {
      toast({
        title: "Content required",
        description: "Please write some content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await blogsApi.create(form);
      toast({ title: "Published!", description: "Your post is now live." });
      router.push(`/blog/${res.data._id}`);
    } catch (err: any) {
      toast({
        title: "Failed to publish",
        description: err?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  New Story
                </h1>
                <p className="text-sm text-muted-foreground">
                  Share your thoughts with the world
                </p>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-2 font-semibold"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Input
                name="title"
                placeholder="Your story title..."
                value={form.title}
                onChange={handleChange}
                className="text-2xl font-bold h-14 border-0 border-b rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50"
                style={{
                  fontFamily: "var(--font-epilogue)",
                  fontSize: "1.5rem",
                }}
              />
            </div>

            {/* Thumbnail URL */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border">
              <ImageIcon className="w-5 h-5 text-muted-foreground shrink-0" />
              <Input
                name="thumbnail"
                placeholder="Thumbnail image URL (optional)"
                value={form.thumbnail}
                onChange={handleChange}
                className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Short description
              </label>
              <Textarea
                name="shortDescription"
                placeholder="A brief summary of what this post is about..."
                value={form.shortDescription}
                onChange={handleChange}
                rows={2}
                className="bg-muted/30 border-border resize-none"
              />
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Content
              </label>
              <BlogEditor
                content={form.content}
                onChange={(content) =>
                  setForm((prev) => ({ ...prev, content }))
                }
              />
            </div>

            {/* Bottom submit */}
            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2 font-semibold px-8"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Publishing..." : "Publish Story"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
