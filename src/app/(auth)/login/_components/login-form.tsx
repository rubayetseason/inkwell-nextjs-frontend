"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/services/auth.services";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Feather, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });

      login(res.data.user, res.data.access_token);

      toast({
        title: "Welcome back!",
        description: `Signed in as ${res.data.user.username}`,
      });

      router.push("/");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description:
          err?.response?.data?.message || "Invalid email or password.",
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
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 justify-center mb-8">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Feather className="w-5 h-5 text-primary-foreground" />
        </div>

        <span
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Inkwell
        </span>
      </Link>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back
          </h1>

          <p className="text-muted-foreground text-sm">
            Sign in to continue your story
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                autoComplete="current-password"
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
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 mt-2 font-semibold"
            size="lg"
          >
            {isLoading ? "Signing in..." : "Sign In"}

            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
