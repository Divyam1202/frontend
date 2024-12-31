"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation"; // Correct hook for App Router
//import { useTheme } from "@/app/providers/theme-providers";
import { Navbar } from "@/app/components/navbar"; // Navbar component imported

interface Portfolio {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    username: string;
  };
  portfolioUrl: string;
  bio: string;
  skills: string[];
}

export default function Dashboard() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const router = useRouter();
  //const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch("${API_BASE_URL}/portfolio", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch portfolios");
        }

        const data = await response.json();
        setPortfolios(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Render Navbar */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Showcase Your Work to the World
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Create a stunning portfolio website in minutes. Share your projects,
            skills, and experience with potential clients and employers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/portfolio/register">
              <Button size="lg" className="text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="text-lg">
                Explore Portfolios
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-8">
            <h3 className="text-xl font-semibold mb-4">Easy to Use</h3>
            <p className="text-muted-foreground">
              Create and customize your portfolio with our intuitive interface.
              No coding required.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-8">
            <h3 className="text-xl font-semibold mb-4">Professional Design</h3>
            <p className="text-muted-foreground">
              Choose from beautiful templates designed to make your work stand
              out.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-8">
            <h3 className="text-xl font-semibold mb-4">Always Up to Date</h3>
            <p className="text-muted-foreground">
              Update your portfolio anytime, anywhere. Keep your achievements
              current.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
