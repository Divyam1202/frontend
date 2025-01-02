// app/student/course/[courseId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useTheme } from "@/app/providers/theme-providers";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { User } from "@/app/types/user";

type Module = {
  title: string;
  resourceLink: string;
};

type Course = {
  title: string;
  description: string;
  courseCode: string;
  modules: Module[];
};

const CourseDetailsPage = () => {
  const router = useRouter();
  const { courseId } = useParams();
  const { theme, toggleTheme } = useTheme();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useState<User | null>(getUser() as User | null);

  useEffect(() => {
    if (!user || !hasRole(["student"])) {
      router.push("/login");
      return;
    }

    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCourse(response.data.course);
        } else {
          setError(response.data.message || "Error fetching course details");
        }
      } catch (error) {
        setError("Failed to fetch course details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [router, user, courseId]);

  const handleBackToCourses = () => {
    router.push("/student/mycourses");
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
                onClick={handleBackToCourses}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-200"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center p-4">Loading course details...</div>
        ) : course ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {course.description}
            </p>
            <h2 className="text-2xl font-semibold mb-2">Modules</h2>
            <ul className="list-disc list-inside">
              {course.modules.map((module) => (
                <li
                  key={module.title}
                  className="text-gray-700 dark:text-gray-300"
                >
                  <a
                    href={module.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {module.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center">
            Course not found.
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseDetailsPage;
