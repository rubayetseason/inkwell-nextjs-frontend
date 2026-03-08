"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/user/follow-button";
import { BlogCard } from "@/components/blog/blog-card";
import { User, Blog } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { getAvatarFallback } from "@/helpers/getAvatarFallback";
import { formatDate } from "@/helpers/formatRelativeTime";
import { usersApi } from "@/services/users.services";
import { blogsApi } from "@/services/blogs.services";

type Tab = "posts" | "followers" | "following";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, blogsRes, followersRes, followingRes] =
          await Promise.all([
            usersApi.getUser(id),
            blogsApi.getByUser(id),
            usersApi.getFollowers(id),
            usersApi.getFollowing(id),
          ]);
        setProfile(profileRes.data);
        setBlogs(blogsRes.data.blogs);
        setFollowers(followersRes.data);
        setFollowing(followingRes.data);
      } catch {
        // handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isOwnProfile = currentUser?._id === id;
  const isFollowing =
    currentUser && profile
      ? (profile.followers as any[])?.some(
          (f) => (typeof f === "string" ? f : f._id) === currentUser._id,
        )
      : false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const tabs = [
    { id: "posts" as Tab, label: "Posts", count: blogs.length, icon: BookOpen },
    {
      id: "followers" as Tab,
      label: "Followers",
      count: followers.length,
      icon: Users,
    },
    {
      id: "following" as Tab,
      label: "Following",
      count: following.length,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-primary/20 via-muted to-secondary mt-16">
        {profile.coverPhoto && (
          <Image
            src={profile.coverPhoto}
            alt="Cover"
            fill
            className="object-cover"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-16">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <Avatar className="w-20 h-20 ring-4 ring-background shadow-xl -mt-12">
              <AvatarImage src={profile.profilePicture} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {getAvatarFallback(profile.username)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                {profile.username}
              </h1>
              {profile.bio && (
                <p className="text-muted-foreground text-sm mt-1 max-w-lg">
                  {profile.bio}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {profile.dateOfBirth && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    Born {formatDate(profile.dateOfBirth)}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <FollowButton
                  userId={profile._id}
                  initialIsFollowing={!!isFollowing}
                  onToggle={(following) => {
                    setProfile((prev) => {
                      if (!prev || !currentUser) return prev;
                      const followers = prev.followers as any[];
                      if (following) {
                        return {
                          ...prev,
                          followers: [...followers, currentUser._id],
                        };
                      }
                      return {
                        ...prev,
                        followers: followers.filter(
                          (f) =>
                            (typeof f === "string" ? f : f._id) !==
                            currentUser._id,
                        ),
                      };
                    });
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-muted/30 rounded-xl p-1 border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-card border border-border shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "bg-muted"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {blogs.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No posts yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.map((blog, i) => (
                    <BlogCard key={blog._id} blog={blog} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "followers" && (
            <motion.div
              key="followers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {followers.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No followers yet.</p>
                </div>
              ) : (
                followers.map((follower) => (
                  <UserListItem
                    key={follower._id}
                    user={follower}
                    currentUserId={currentUser?._id}
                  />
                ))
              )}
            </motion.div>
          )}

          {activeTab === "following" && (
            <motion.div
              key="following"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {following.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    Not following anyone yet.
                  </p>
                </div>
              ) : (
                following.map((f) => (
                  <UserListItem
                    key={f._id}
                    user={f}
                    currentUserId={currentUser?._id}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function UserListItem({
  user,
  currentUserId,
}: {
  user: User;
  currentUserId?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
    >
      <Link
        href={`/profile/${user._id}`}
        className="flex items-center gap-3 group"
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.profilePicture} />
          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
            {getAvatarFallback(user.username)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm group-hover:text-primary transition-colors">
            {user.username}
          </p>
          {user.bio && (
            <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
              {user.bio}
            </p>
          )}
        </div>
      </Link>
      {currentUserId && currentUserId !== user._id && (
        <FollowButton userId={user._id} initialIsFollowing={false} size="sm" />
      )}
    </motion.div>
  );
}
