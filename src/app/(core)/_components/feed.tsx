"use client";

import { useAuthStore } from "@/store/auth.store";
import { TimelineFeed } from "@/components/blog/timeline-feed";
import FeedHeader from "./feed-header";

export default function Feed() {
  const { user } = useAuthStore();

  return (
    <>
      <FeedHeader user={user} />
      <TimelineFeed isAuthenticated={!!user} />
    </>
  );
}
