"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/theme-providers"; // Adjusted import path
import { getUser, logout, hasRole } from "@/app/utils/auth";

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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseCode: "",
    capacity: 0,
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course); // Set the course to edit
    setFormData({
      title: course.title,
      description: course.description,
      courseCode: course.courseCode,
      capacity: course.capacity,
    });
    setModules(course.modules); // Set the course modules to edit
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleModuleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "title" | "resourceLink"
  ) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = e.target.value;
    setModules(updatedModules);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      const updatedCourse = {
        ...selectedCourse,
        ...formData,
        modules, // Include the updated modules
      };

      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${updatedCourse._id}`,
        updatedCourse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the courses state with the updated course
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course
        )
      );
      setSelectedCourse(null); // Close the edit form
    } catch (err) {
      setError("Failed to update course.");
    }
  };

  const handleCloseEdit = () => {
    setSelectedCourse(null); // Close the edit form without saving
  };

  const handleAddModule = () => {
    setModules([...modules, { title: "", resourceLink: "" }]);
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
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
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl transition-all duration-200"
              >
                Logout
              </button>
              <button
                onClick={() => router.push('/instructor/dashboard')}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="teacher-courses-container max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">My Published Courses</h2>
        {courses.length === 0 ? (
          <div>No courses found.</div>
        ) : (
          <div className="courses-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="course-card p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg hover:bg-purple-200 dark:hover:bg-purple-700 transition duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Description:</strong> {course.description}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Course Code:</strong> {course.courseCode}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Capacity:</strong> {course.capacity}
                </p>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Enrolled Students ({course.students.length}):</h4>
                {course.students.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {course.students.map((student) => (
                      <li key={student._id}>
                        {student.name} ({student.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">No students enrolled yet.</p>
                )}
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Modules:</h4>
                {course.modules.length > 0 ? (
                  <div className="modules-list space-y-4">
                    {course.modules.map((module, index) => (
                      <div
                        key={index}
                        className="module-card p-4 bg-gray-200 dark:bg-gray-700 rounded-md shadow-md hover:bg-purple-200 dark:hover:bg-purple-600 transition-colors duration-300"
                      >
                        <h5 className="font-medium text-gray-900 dark:text-white">{module.title}</h5>
                        {module.resourceLink && module.resourceLink.includes("youtube.com") ? (
                          <div className="video-container mt-2">
                            <iframe
                              width="100%"
                              height="315"
                              src={module.resourceLink.replace("watch?v=", "embed/")}
                              title={`YouTube video for ${module.title}`}
                              frameBorder="0"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300">No video available for this module.</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">No modules available.</p>
                )}

                <button
                  className="edit-button bg-blue-500 text-white p-2 rounded-md mt-4"
                  onClick={() => handleEditClick(course)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedCourse && (
          <div className="edit-course-form bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Course
            </h2>
            <form onSubmit={handleSaveChanges} className="space-y-4">
              {/* Course details form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Module editing section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Modules</h3>

                {modules.map((module, index) => (
                  <div key={index} className="module-form space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Module Title
                      </label>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => handleModuleChange(e, index, "title")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Resource Link
                      </label>
                      <input
                        type="url"
                        value={module.resourceLink}
                        onChange={(e) => handleModuleChange(e, index, "resourceLink")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      type="button"
                      className="remove-module bg-red-500 text-white p-2 rounded-md"
                      onClick={() => handleRemoveModule(index)}
                    >
                      Remove Module
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-module bg-green-500 text-white p-2 rounded-md"
                  onClick={handleAddModule}
                >
                  Add New Module
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="cancel-button px-6 py-3 text-sm font-medium rounded-xl bg-gray-500 text-white"
                  onClick={handleCloseEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button px-6 py-3 text-sm font-medium rounded-xl bg-blue-500 text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
