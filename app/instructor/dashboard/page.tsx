"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { useTheme } from "@/app/providers/theme-providers";
import { User } from "@/app/types/user";
import { API_BASE_URL } from "@/app/config/api";

// interface LeaveStats {
//   pending: number;
//   approved: number;
//   total: number;
// }

export default function InstructorDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(getUser() as User | null);
  // const [leaveStats, setLeaveStats] = useState<LeaveStats>({
  //   pending: 0,
  //   approved: 0,
  //   total: 0,
  // });
  const [loading, setLoading] = useState(true);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuImage, setMenuImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !hasRole(["instructor"])) {
      router.push("/login");
      return;
    }
    fetchLeaveStats();
  }, [router]);

  const fetchLeaveStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/instructor/complaint`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch course stats");
      }

      // const stats = await response.json();
      // console.log(stats);
      // setLeaveStats(stats);
    } catch (error) {
      console.error("Error fetching course stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuImage = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/instructor/createcourse`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch menu");
      }

      const data = await response.json();
      if (data.url) {
        setMenuImage(data.url);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    if (isMenuModalOpen) {
      fetchMenuImage();
    }
  }, [isMenuModalOpen]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                Learn X Port
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                |
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Instructor Portal
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* <button
                onClick={() => setIsMenuModalOpen(true)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                View Menu
              </button> */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user.firstName} 👋
            </h2>
            <p className="text-blue-100">
              Manage student courses and help solve querries from your dashboard
            </p>
          </div>
        </div>

        {/* Quick Stats
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Requests
                </p>
                {loading ? (
                  <div className="h-8 w-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaveStats.pending}
                  </h3>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Approved Leaves
                </p>
                {loading ? (
                  <div className="h-8 w-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaveStats.approved}
                  </h3>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Applications
                </p>
                {loading ? (
                  <div className="h-8 w-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaveStats.total}
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div> */}

        {/* Quick Actions */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* <button
            onClick={() => router.push("/instructor/leaves")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pending Leaves
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Review pending leave applications
            </p>
          </button> */}

          <button
            onClick={() => router.push("/instructor/createcourse")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Course Creation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and Create courses
            </p>
          </button>

          <button
            onClick={() => router.push("/instructor/allcourses")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              All Courses
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View courses published by you
            </p>
          </button>

          <button
            onClick={() => router.push("/instructor/profile")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              My Profile
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and edit your profile
            </p>
          </button>

          <button
            onClick={() => router.push("/instructor/attendance")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Assignmnets or Quizzes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track and manage student performance
            </p>
          </button>

          <button
            onClick={() => router.push("/instructor/complaints")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Complaints
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and handle student complaints
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}
