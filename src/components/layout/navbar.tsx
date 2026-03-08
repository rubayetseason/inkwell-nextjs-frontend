"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatarFallback } from "@/helpers/getAvatarFallback";
import { useAuthStore } from "@/store/auth.store";
import { AnimatePresence, motion } from "framer-motion";
import {
  Feather,
  LayoutDashboard,
  LogOut,
  Menu,
  PenLine,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: -10 }}
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
            >
              <Feather className="w-4 h-4 text-primary-foreground" />
            </motion.div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              Inkwell
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search button */}
            <Link href="/search">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary-foreground"
              >
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            {user ? (
              <>
                <Link href="/kanban">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-primary-foreground"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Board
                  </Button>
                </Link>
                <Link href="/create-blog">
                  <Button
                    size="sm"
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <PenLine className="w-4 h-4" />
                    Write
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 ml-2 rounded-full ring-2 ring-transparent hover:ring-primary/50 transition-all">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                          {getAvatarFallback(user.username)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-52 bg-card border-border"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/profile/${user._id}`}
                        className="cursor-pointer"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/edit" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getAvatarFallback(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/create-blog"
                    className="flex items-center gap-2 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <PenLine className="w-4 h-4" /> Write
                  </Link>
                  <Link
                    href="/kanban"
                    className="flex items-center gap-2 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Kanban Board
                  </Link>
                  <Link
                    href="/search"
                    className="flex items-center gap-2 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Search className="w-4 h-4" /> Search
                  </Link>
                  <Link
                    href={`/profile/${user._id}`}
                    className="flex items-center gap-2 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="flex items-center gap-2 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-sm text-destructive w-full"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/search" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full gap-2">
                      <Search className="w-4 h-4" /> Search
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
