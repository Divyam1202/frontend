"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Users, Award, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background px-4 py-20 md:px-6 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Learn Without Limits
            </h1>
            <p className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Start, switch, or advance your career with thousands of courses or showcase your work with a portfolio.
            </p>
            <div className="mt-8 flex gap-4">
              {/* Portfolio Button (Blue) */}
              <Link href="/portfolio">
                <Button size="lg" className="bg-blue-500 hover:bg-purple-500 text-white">
                  Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {/* Courses Button (Blue) */}
              <Link href="/login"> {/* Redirecting to login/register */}
                <Button size="lg" className="bg-blue-500 hover:bg-orange-500 text-white">
                  Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dark/Light Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        </button>
      </div>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Expert Learning</h3>
              <p className="text-muted-foreground">
                Learn from industry experts and top universities worldwide.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Collaborative Learning</h3>
              <p className="text-muted-foreground">
                Join a global community of learners and share knowledge.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Verified Certificates</h3>
              <p className="text-muted-foreground">
                Earn recognized certificates to showcase your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
