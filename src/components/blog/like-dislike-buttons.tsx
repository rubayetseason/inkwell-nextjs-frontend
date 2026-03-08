'use client';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { blogsApi } from '@/services/blogs.services';
import { useAuthStore } from '@/store/auth.store';
import { Blog } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

interface LikeDislikeButtonsProps {
  blog: Blog;
  onUpdate?: (updated: Blog) => void;
  size?: 'sm' | 'lg';
}

export function LikeDislikeButtons({ blog, onUpdate, size = 'sm' }: LikeDislikeButtonsProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [currentBlog, setCurrentBlog] = useState(blog);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  const isLiked = user && currentBlog.likes?.includes(user._id);
  const isDisliked = user && currentBlog.dislikes?.includes(user._id);

  const handleLike = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to like posts.', variant: 'destructive' });
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await blogsApi.like(currentBlog._id);
      setCurrentBlog(res.data);
      onUpdate?.(res.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to like post.', variant: 'destructive' });
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to dislike posts.', variant: 'destructive' });
      return;
    }
    if (isDisliking) return;
    setIsDisliking(true);
    try {
      const res = await blogsApi.dislike(currentBlog._id);
      setCurrentBlog(res.data);
      onUpdate?.(res.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to dislike post.', variant: 'destructive' });
    } finally {
      setIsDisliking(false);
    }
  };

  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const btnBase = size === 'lg'
    ? 'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all'
    : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all';

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleLike}
        disabled={isLiking}
        className={cn(
          btnBase,
          'border',
          isLiked
            ? 'bg-red-500/10 border-red-500/40 text-red-400'
            : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-red-500/30',
        )}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={isLiked ? 'liked' : 'not-liked'}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <Heart className={cn(iconSize, isLiked && 'fill-red-400')} />
          </motion.span>
        </AnimatePresence>
        <span className="font-semibold">{currentBlog.likes?.length || 0}</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleDislike}
        disabled={isDisliking}
        className={cn(
          btnBase,
          'border',
          isDisliked
            ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
            : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-blue-500/30',
        )}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={isDisliked ? 'disliked' : 'not-disliked'}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <ThumbsDown className={cn(iconSize, isDisliked && 'fill-blue-400')} />
          </motion.span>
        </AnimatePresence>
        <span className="font-semibold">{currentBlog.dislikes?.length || 0}</span>
      </motion.button>
    </div>
  );
}
