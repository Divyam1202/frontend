"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { useTheme } from "@/app/providers/theme-providers";
import axios from "axios";


// Types for state and components
interface Module {
  title: string;
  resourceLink: string;
}

interface CourseDetails {
  title: string;
  description: string;
  courseCode: string;
  capacity: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}

const CreateCourse = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    title: "",
    description: "",
    courseCode: "",
    capacity: "",
  });

  const [modules, setModules] = useState<Module[]>([
    { title: "", resourceLink: "" },
  ]);

  const [message, setMessage] = useState<Message | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleModuleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedModules = modules.map((module, i) =>
      i === index ? { ...module, [name]: value } : module
    );
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules([...modules, { title: "", resourceLink: "" }]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Assuming you store JWT in localStorage
      const response = await axios.post(
        "http://localhost:5000/api/courses/create",
        { ...courseDetails, modules },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({ type: "success", text: response.data.message });
      setCourseDetails({ title: "", description: "", courseCode: "", capacity: "" });
      setModules([{ title: "", resourceLink: "" }]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage({
          type: "error",
          text: error.response.data.message || "An error occurred",
        });
      } else {
        setMessage({
          type: "error",
          text: "An unexpected error occurred",
        });
      }
    }
  };

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
          <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
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
            onClick={() => router.push("/instructor/dashboard")}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  </nav>

  {/* Form Container */}
  <div className="create-course-container max-w-7xl mx-auto p-6 border border-gray-200 dark:border-gray-900 rounded-xl">
    <h2 className="text-3xl font-extrabold text-blue-600 dark:text-blue-600 mb-6">
      Create a New Course
    </h2>
    {message && (
      <div
        className={`message ${
          message.type === "success"
            ? "bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400"
            : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
        } p-4 rounded-xl text-sm`}
      >
        {message.text}
      </div>
    )}
    <form
      onSubmit={handleSubmit}
      className="create-course-form space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
    >
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 dark:text-blue-300 mb-1">
          Course Title
        </label>
        <input
          type="text"
          name="title"
          value={courseDetails.title}
          onChange={handleInputChange}
          required
          placeholder="Enter course title"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 dark:text-blue-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={courseDetails.description}
          onChange={handleInputChange}
          required
          placeholder="Enter course description"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        ></textarea>
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 dark:text-blue-300 mb-1">
          Course Code
        </label>
        <input
          type="text"
          name="courseCode"
          value={courseDetails.courseCode}
          onChange={handleInputChange}
          required
          placeholder="Enter course code"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 dark:text-blue-300 mb-1">
          Capacity
        </label>
        <input
          type="number"
          name="capacity"
          value={courseDetails.capacity}
          onChange={handleInputChange}
          required
          placeholder="Enter course capacity"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        />
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 dark:text-blue-300 mt-6">
        Modules
      </h3>
      {modules.map((module, index) => (
        <div key={index} className="module-group space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-blue-500 mb-1">
              Module Title
            </label>
            <input
              type="text"
              name="title"
              value={module.title}
              onChange={(e) => handleModuleChange(index, e)}
              required
              placeholder="Enter module title"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-blue-500 mb-1">
              Resource Link
            </label>
            <input
              type="url"
              name="resourceLink"
              value={module.resourceLink}
              onChange={(e) => handleModuleChange(index, e)}
              required
              placeholder="Enter resource link (YouTube URL)"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <button
            type="button"
            className="remove-module-btn px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            onClick={() => removeModule(index)}
            disabled={modules.length === 1}
          >
            Remove Module
          </button>
        </div>
      ))}
      <button
        type="button"
        className="add-module-btn px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        onClick={addModule}
      >
        Add Module
      </button>

      <button
        type="submit"
        className="submit-btn w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Create Course
      </button>
    </form>
  </div>
</div>
  );
};

export default CreateCourse;
