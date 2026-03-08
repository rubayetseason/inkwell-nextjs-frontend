"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, UserCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usersApi } from "@/services/users.services";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  onToggle?: (isFollowing: boolean) => void;
  size?: "sm" | "default";
}

export function FollowButton({
  userId,
  initialIsFollowing,
  onToggle,
  size = "default",
}: FollowButtonProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user._id === userId) return null;

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isFollowing) {
        await usersApi.unfollow(userId);
        setIsFollowing(false);
        onToggle?.(false);
        toast({
          title: "Unfollowed",
          description: "You are no longer following this user.",
        });
      } else {
        await usersApi.follow(userId);
        setIsFollowing(true);
        onToggle?.(true);
        toast({
          title: "Following!",
          description: "You are now following this user.",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <Button
        onClick={handleToggle}
        disabled={isLoading}
        size={size}
        variant={isFollowing ? "secondary" : "default"}
        className={cn(
          "gap-2 font-semibold transition-all",
          isFollowing
            ? "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            : "bg-primary text-primary-foreground",
        )}
      >
        {isFollowing ? (
          <>
            <UserCheck className="w-4 h-4" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Follow
          </>
        )}
      </Button>
    </motion.div>
  );
}
