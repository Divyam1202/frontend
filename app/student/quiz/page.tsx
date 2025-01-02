"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/theme-providers";

export default function InstructorQuizPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [type, setType] = useState<"quiz" | "assignment" | "">(""); // "" for initial step
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(
    null
  );
  const [quizCount, setQuizCount] = useState(0); // Counter for quizzes
  const [assignmentCount, setAssignmentCount] = useState(0); // Counter for assignments
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch quizzes and assignments when the type is selected
    if (type === "quiz") {
      fetchQuizzes();
    } else if (type === "assignment") {
      fetchAssignments();
    }
  }, [type]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/quizzes");
      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      const data = await response.json();
      setQuizzes(data);
      setQuizCount(data.length); // Update quiz count
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/assignments");
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }
      const data = await response.json();
      setAssignments(data);
      setAssignmentCount(data.length); // Update assignment count
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = (quiz: any) => {
    setSelectedQuiz(quiz);
  };

  const handleAssignmentClick = (assignment: any) => {
    setSelectedAssignment(assignment);
  };

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      // Redirect to the quiz page or show options to start
      router.push(`/quiz/${selectedQuiz.id}`);
    }
  };

  const handleSubmitAssignment = () => {
    if (selectedAssignment) {
      // Redirect to the assignment submission page or show submission form
      router.push(`/assignment/submit/${selectedAssignment.id}`);
    }
  };
  const logout = () => {
    // Implement logout functionality here
    console.log("Logged out");
  };
  const handleBackToDashboard = () => {
    router.push("/student/dashboard");
  };

  if (!type) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold mb-4">Choose Type</h1>
          <button
            onClick={() => setType("quiz")}
            className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Submit Quiz
          </button>
          <button
            onClick={() => setType("assignment")}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Submit Assignment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Instructor Portal</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl transition-all duration-200"
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
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">
            {type === "quiz" ? "Select a Quiz" : "Select an Assignment"}
          </h1>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Total Quizzes Submitted: {quizCount} | Total Assignments Submitted:{" "}
            {assignmentCount}
          </p>
          {error && <p className="text-red-500">{error}</p>}
          {loading && <p>Loading...</p>}

          {/* Display quizzes or assignments */}
          {type === "quiz" && quizzes.length > 0 && (
            <div>
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="cursor-pointer mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  onClick={() => handleQuizClick(quiz)}
                >
                  <h2 className="text-xl font-semibold">{quiz.title}</h2>
                </div>
              ))}
              {selectedQuiz && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold">
                    Selected Quiz: {selectedQuiz.title}
                  </h3>
                  <button
                    onClick={handleStartQuiz}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Start Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {type === "assignment" && assignments.length > 0 && (
            <div>
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="cursor-pointer mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  onClick={() => handleAssignmentClick(assignment)}
                >
                  <h2 className="text-xl font-semibold">{assignment.title}</h2>
                </div>
              ))}
              {selectedAssignment && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold">
                    Selected Assignment: {selectedAssignment.title}
                  </h3>
                  <button
                    onClick={handleSubmitAssignment}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Submit Assignment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
