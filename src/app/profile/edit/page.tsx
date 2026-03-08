"use client";

import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAvatarFallback } from "@/helpers/getAvatarFallback";
import { useToast } from "@/hooks/use-toast";
import { usersApi } from "@/services/users.services";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Image as ImageIcon,
  Save,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfilePage() {
  const { user, setUser, login, token } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    username: "",
    bio: "",
    profilePicture: "",
    coverPhoto: "",
    dateOfBirth: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    setForm({
      username: user.username || "",
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
      coverPhoto: user.coverPhoto || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await usersApi.updateProfile(form);
      setUser(res.data);
      if (token) login(res.data, token);
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved.",
      });
      router.push(`/profile/${user?._id}`);
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Link href={`/profile/${user._id}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </Button>
            </Link>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Edit Profile
            </h1>
          </div>

          {/* Avatar Preview */}
          <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl mb-6">
            <Avatar className="w-16 h-16 ring-4 ring-background">
              <AvatarImage src={form.profilePicture || user.profilePicture} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {getAvatarFallback(form.username || user.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{form.username || user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-card border border-border rounded-2xl p-6"
          >
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Username
                </label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="your_username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Bio
                </label>
                <Textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  Profile Picture URL
                </label>
                <Input
                  name="profilePicture"
                  value={form.profilePicture}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  Cover Photo URL
                </label>
                <Input
                  name="coverPhoto"
                  value={form.coverPhoto}
                  onChange={handleChange}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Date of Birth
                </label>
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Link href={`/profile/${user._id}`}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2 font-semibold px-8"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
