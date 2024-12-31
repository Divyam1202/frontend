"use client";

import { useAuth } from "@/app/providers/auth-providers";
import { Button } from "@/components/ui/button";
import { Search } from "@/app/components/search";
import { useTheme } from "@/app/providers/theme-providers";
import Link from "next/link";
// import { UserCircle } from "lucide-react";

export function Navbar() {
  const { session } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
            Portfolio Hub
          </Link>

          <div className="flex-1 max-w-md mx-4">
            <Search />
          </div>

          <div className="flex items-center gap-4">
            {session.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href={`/portfolio/${session.user.username}`}>
                  <Button variant="ghost">My Portfolio</Button>
                </Link>
              </>
            ) : (
              <>
              {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
                <Link href="/portfolio/login">
                  <Button size="lg"
                className="top-6 right-6 p-2 rounded-xl bg-blue-500 hover:bg-orange-500 text-white">
                  Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}