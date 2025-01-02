"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/theme-providers";

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Module {
  title: string;
  resourceLink: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  capacity: number;
  students: Student[];
  modules: Module[];
}

const TeacherCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/allinstructorcourses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourses(response.data.courses);
        setError(null);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || "Failed to fetch courses.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewMore = (course: Course) => {
    setSelectedCourse(selectedCourse?._id === course._id ? null : course);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery) ||
      course.description.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <button
                onClick={() => router.push("/instructor/dashboard")}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="teacher-courses-container max-w-7xl mx-auto p-6">
        <div className="search-bar mb-6">
          <input
            type="text"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          My Published Courses
        </h2>

        {filteredCourses.length === 0 ? (
          <div>No courses found.</div>
        ) : (
          <div className="courses-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="course-card p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg hover:bg-purple-200 dark:hover:bg-purple-700 transition duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {course.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 truncate">
                  {course.description}
                </p>
                <button
                  className="view-more bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                  onClick={() => handleViewMore(course)}
                >
                  {selectedCourse?._id === course._id
                    ? "Hide Details"
                    : "View More"}
                </button>

                {selectedCourse?._id === course._id && (
                  <div className="course-details mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Modules:
                    </h4>
                    {selectedCourse.modules.map((module, index) => (
                      <div
                        key={index}
                        className="module-card p-4 bg-gray-300 dark:bg-gray-600 rounded-md shadow-md"
                      >
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {module.title}
                        </h5>
                        {module.resourceLink.includes("youtube.com") ? (
                          <iframe
                            width="100%"
                            height="200"
                            src={module.resourceLink.replace(
                              "watch?v=",
                              "embed/"
                            )}
                            title={`YouTube video for ${module.title}`}
                            frameBorder="0"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300">
                            No video available.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
