"use client";

import { useState, useEffect } from "react";
import axios from "axios";  // Import axios
import { useRouter } from "next/navigation"; // Import useRouter
import { useTheme } from "@/app/providers/theme-providers";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { User } from "@/app/types/user";

type Course = {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  capacity: number;
  isEnrolled: boolean;
};

export default function EnrollCoursePage() {
  const router = useRouter(); // Initialize router first
  const { theme, toggleTheme } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user] = useState<User | null>(getUser() as User | null);

  // Get the authentication token (usually stored in localStorage or sessionStorage)
  const token = localStorage.getItem("token"); // Assuming the token is saved in localStorage

  // Fetch the courses when the component mounts
  useEffect(() => {
    if (!user || !hasRole(["student"])) {
      router.push("/login");
      return;
    }

    const fetchCourses = async () => {
      if (!token) {
        setErrorMessage("No authentication token found");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use the token for Authorization
            },
          }
        );
        
        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          setErrorMessage("Failed to fetch courses");
        }
      } catch (error) {
        setErrorMessage("Error fetching courses");
      }
    };

    fetchCourses();
  }, [token, user, router]); // Adding token as a dependency to refetch when token changes

  const handleEnroll = async (courseId: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/enroll`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
        
        
      });
      console.log(courseId);
      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Successfully enrolled in the course!");
        setEnrolledCourses([...enrolledCourses, courses.find(course => course._id === courseId)!]);
        setCourses(courses.map(course => 
          course._id === courseId ? { ...course, isEnrolled: true } : course
        ));
      } else {
        setErrorMessage(data.message || "Error enrolling in course");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Enroll in a Course 📑</h2>
            <p className="text-blue-100">
              Select a course from the list below and click "Enroll" to join.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-6">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
            {errorMessage}
          </div>
        )}

        {/* Course list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className={`p-4 border rounded-lg shadow-lg transition ${
                course.isEnrolled
                  ? "border-green-500 bg-green-50 dark:bg-green-800/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{course.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{course.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                <strong>Course Code:</strong> {course.courseCode}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                <strong>Capacity:</strong> {course.capacity}
              </p>

              <button
                className={`mt-4 px-6 py-2 text-white font-semibold rounded-lg ${
                  isSubmitting || course.isEnrolled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition`}
                onClick={() => handleEnroll(course._id)}
                disabled={isSubmitting || course.isEnrolled}
              >
                {isSubmitting ? "Enrolling..." : course.isEnrolled ? "Enrolled" : "Enroll"}
              </button>
            </div>
          ))}
        </div>

        {/* Displaying the list of enrolled courses */}
        {enrolledCourses.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Enrolled Courses</h2>
            <ul className="space-y-4">
              {enrolledCourses.map((course) => (
                <li key={course._id} className="p-4 border rounded-lg shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{course.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    <strong>Course Code:</strong> {course.courseCode}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    <strong>Capacity:</strong> {course.capacity}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
