"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Use next/navigation for client-side routing
import { getPortfolios } from "@/app/utils/api";

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

const PortfolioPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    if (username) {
      const fetchPortfolio = async () => {
        const portfolios = await getPortfolios();
        const userPortfolio = portfolios.find(
          (p: Portfolio) => p.user.username === username
        );
        setPortfolio(userPortfolio);
      };
      fetchPortfolio();
    }
  }, [username]);

  if (!portfolio) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
            {portfolio.user.firstName} {portfolio.user.lastName}'s Portfolio
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            @{portfolio.user.username}
          </p>

          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bio
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{portfolio.bio}</p>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Skills:
            </h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
              {portfolio.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Back to Dashboard Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/portfolio/dashboard")}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
