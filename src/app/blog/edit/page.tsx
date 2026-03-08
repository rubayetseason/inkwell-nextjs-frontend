'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { BlogEditor } from '@/components/blog/blog-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';
import { blogsApi } from '@/services/blogs.services';

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ title: '', shortDescription: '', content: '', thumbnail: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogsApi.getById(id);
        const blog = res.data;
        if (blog.author?._id !== user?._id) {
          toast({ title: 'Unauthorized', variant: 'destructive' });
          router.push('/');
          return;
        }
        setForm({
          title: blog.title,
          shortDescription: blog.shortDescription,
          content: blog.content,
          thumbnail: blog.thumbnail || '',
        });
      } catch {
        toast({ title: 'Error loading blog', variant: 'destructive' });
        router.push('/');
      } finally {
        setIsFetching(false);
      }
    };
    if (user) fetchBlog();
  }, [id, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await blogsApi.update(id, form);
      toast({ title: 'Updated!', description: 'Your post has been updated.' });
      router.push(`/blog/${id}`);
    } catch (err: any) {
      toast({
        title: 'Failed to update',
        description: err?.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href={`/blog/${id}`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Edit Story
              </h1>
            </div>
            <Button onClick={handleSubmit} disabled={isLoading} className="gap-2 font-semibold">
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="title"
              placeholder="Your story title..."
              value={form.title}
              onChange={handleChange}
              className="text-2xl font-bold h-14 border-0 border-b rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}
            />

            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border">
              <ImageIcon className="w-5 h-5 text-muted-foreground shrink-0" />
              <Input
                name="thumbnail"
                placeholder="Thumbnail image URL (optional)"
                value={form.thumbnail}
                onChange={handleChange}
                className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Short description</label>
              <Textarea
                name="shortDescription"
                placeholder="A brief summary..."
                value={form.shortDescription}
                onChange={handleChange}
                rows={2}
                className="bg-muted/30 border-border resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Content</label>
              <BlogEditor
                content={form.content}
                onChange={(content) => setForm((prev) => ({ ...prev, content }))}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" disabled={isLoading} className="gap-2 font-semibold px-8">
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
