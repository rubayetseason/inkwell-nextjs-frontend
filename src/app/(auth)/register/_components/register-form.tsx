"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Feather,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/services/auth.services";

export default function RegisterForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (form.password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.register(form);

      login(res.data.user, res.data.access_token);

      toast({
        title: "Account created!",
        description: `Welcome to Inkwell, ${res.data.user.username}!`,
      });

      router.push("/");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Link href="/" className="flex items-center gap-2 justify-center mb-8">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Feather className="w-5 h-5 text-primary-foreground" />
        </div>

        <span
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          Inkwell
        </span>
      </Link>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Start your story
          </h1>

          <p className="text-muted-foreground text-sm">
            Create an account to join the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="username">
              Username
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                id="username"
                name="username"
                type="text"
                placeholder="your_username"
                value={form.username}
                onChange={handleChange}
                className="pl-10"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="pl-10"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="pl-10 pr-10"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              At least 6 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 mt-2 font-semibold"
            size="lg"
          >
            {isLoading ? "Creating account..." : "Create Account"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
