// app/student/play/[courseId]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTheme } from "@/app/providers/theme-providers";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { User } from "@/app/types/user";

interface Module {
  title: string;
  resourceLink: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  modules: Module[];
}

export default function PlayCourse({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { courseId } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useState<User | null>(getUser() as User | null);

  useEffect(() => {
    if (!user || !hasRole(["student"])) {
      router.push("/login");
      return;
    }

    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/student/play/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.course) {
          throw new Error('Course not found');
        }

        setCourse(response.data.course);
        if (response.data.course.modules?.length > 0) {
          setCurrentModule(response.data.course.modules[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      setError('Course ID is missing');
      setLoading(false);
    }
  }, [courseId, router, user]);

  const handleModuleSelect = (module: Module) => {
    setCurrentModule(module);
    // Here you could add progress tracking logic
  };

  const handleBackToDashboard = () => {
    router.push("/student/dashboard");
  };

  const handleBackToCourses = () => {
    router.push("/student/mycourses");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-center p-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Courses
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center p-4">Course not found</div>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Courses
        </button>
      </div>
    );
  }

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
              <button
                onClick={handleBackToCourses}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 rounded-xl transition-all duration-200"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <span>←</span> Back to Courses
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Modules</h2>
            <div className="space-y-2">
              {course.modules.map((module, index) => (
                <button
                  key={index}
                  onClick={() => handleModuleSelect(module)}
                  className={`w-full p-3 text-left rounded-lg transition-colors ${
                    currentModule?.title === module.title
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {module.title}
                </button>
              ))}
            </div>
          </div>

          <div className="md:w-3/4">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">{course.title}</h1>
            <p className="text-gray-600 text-lg mb-4">{course.description}</p>
            {currentModule && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{currentModule.title}</h3>
                {currentModule.resourceLink.includes('youtube.com') ? (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={currentModule.resourceLink.replace('watch?v=', 'embed/')}
                      className="w-full h-[500px] rounded-lg"
                      allowFullScreen
                      sandbox="allow-same-origin allow-scripts allow-popups"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <iframe
                    src={currentModule.resourceLink}
                    className="w-full h-[500px] rounded-lg"
                    sandbox="allow-same-origin allow-scripts"
                    loading="lazy"
                    title={currentModule.title}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}