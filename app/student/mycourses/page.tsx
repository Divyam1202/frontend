"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Changed from next/router
import { useTheme } from "@/app/providers/theme-providers";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { User } from "@/app/types/user";

type Module = {
  title: string;
  resourceLink: string;
};

type ProgressEntry = {
  student: string;
  progress: number;
  lastPlayedModule?: string | null;
};

type Course = {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  capacity: number;
  instructor: string;
  students: string[];
  status: string;
  modules: Module[];
  progress: number;
};

const EnrolledCoursesPage = () => {
  const router = useRouter(); // Initialize router first
  const { theme, toggleTheme } = useTheme();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useState<User | null>(getUser() as User | null);

  useEffect(() => {
    if (!user || !hasRole(["student"])) {
      router.push("/login");
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/student/mycourses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const updatedCourses = response.data.courses.map((course: any) => ({
            ...course,
            progress: course.progress.length > 0 ? course.progress[0].progress : 0, // Default progress to 0 if not provided
          })) as Course[];
          setEnrolledCourses(updatedCourses);
        } else {
          setError(response.data.message || "Error fetching courses");
        }
      } catch (error) {
        setError("Failed to fetch courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [router, user]);

  const handlePlayCourse = (courseId: string) => {
    router.push(`/student/play/${courseId}`);
  };

  const handleBackToDashboard = () => {
    router.push("/student/dashboard");
  };

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
                Student Portal
              </span>
            </div>
            <div className="flex items-center gap-4">
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
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Your Enrolled Courses 🎬</h2>
            <p className="text-blue-100">
              Here are your courses begin
              Happy Learning!
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-6">{error}</div>
        )}

        {isLoading ? (
          <div className="text-center p-4">Loading your courses...</div>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="p-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {course.description}
                </p>

                {/* <div className="mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Progress: {course.progress}%
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div> */}

                <button
                  onClick={() => handlePlayCourse(course._id)}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-orange-400 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Play Course
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center">
            You are not enrolled in any courses.
          </div>
        )}
      </main>
    </div>
  );
};

export default EnrolledCoursesPage;