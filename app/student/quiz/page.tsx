"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/theme-providers";
import { API_BASE_URL } from "@/app/config/api";

export default function StudentQuizPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [type, setType] = useState<"quiz" | "assignment" | "">(""); // "" for initial step
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<
    string | null
  >(null);
  const [quizCount, setQuizCount] = useState(0); // Counter for quizzes
  const [assignmentCount, setAssignmentCount] = useState(0); // Counter for assignments
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<string>("");

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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await fetch(`${API_BASE_URL}/api/quiz/student/quizzes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();
      setQuizzes(data.quizzes);
      setQuizCount(data.quizzes.length); // Update quiz count
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/quiz/student/assignments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }
      const data = await response.json();
      setAssignments(data.assignments);
      setAssignmentCount(data.assignments.length); // Update assignment count
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuizDetails = (quizId: string) => {
    setExpandedQuizId((prev) => (prev === quizId ? null : quizId));
  };

  const toggleAssignmentDetails = (assignmentId: string) => {
    setExpandedAssignmentId((prev) =>
      prev === assignmentId ? null : assignmentId
    );
  };

  const handleStartQuiz = (quizId: string) => {
    setSubmissionStatus(`Started Quiz: ${quizId}`);
    setExpandedQuizId(quizId); // Expand the quiz details to show the form
  };

  const handleSubmitAssignment = (assignmentId: string) => {
    setSubmissionStatus(`Submitted Assignment: ${assignmentId}`);
    setExpandedAssignmentId(assignmentId); // Expand the assignment details to show the form
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
            Start Quiz
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
          <h1 className="text-2xl font-bold">Student Portal</h1>
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
          {submissionStatus && (
            <p className="text-green-500">{submissionStatus}</p>
          )}

          {/* Display quizzes or assignments */}
          {type === "quiz" && quizzes.length > 0 && (
            <div>
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className={`cursor-pointer mb-4 p-4 rounded-lg ${
                    expandedQuizId === quiz._id
                      ? "bg-blue-100 dark:bg-blue-700"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{quiz.title}</h2>
                    <button
                      onClick={() => toggleQuizDetails(quiz._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      {expandedQuizId === quiz._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>
                  {expandedQuizId === quiz._id && (
                    <div className="mt-4 space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Scheduled Time:{" "}
                        {new Date(quiz.scheduleTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Duration: {quiz.duration} minutes
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Passing Score: {quiz.passingScore}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Questions: {quiz.totalQuestions}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Instructions:{" "}
                        {quiz.instructions || "No instructions provided."}
                      </p>
                      <button
                        onClick={() => handleStartQuiz(quiz._id)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Start Quiz
                      </button>
                      {/* Quiz Form */}
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">Quiz Form</h3>
                        <form>
                          {quiz.questions.map(
                            (question: any, index: number) => (
                              <div key={index} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {question.question}
                                </label>
                                {question.options.map(
                                  (option: string, optIndex: number) => (
                                    <div key={optIndex} className="mt-2">
                                      <input
                                        type="radio"
                                        name={`question-${index}`}
                                        value={option}
                                        className="mr-2"
                                      />
                                      <label className="text-sm text-gray-600 dark:text-gray-400">
                                        {option}
                                      </label>
                                    </div>
                                  )
                                )}
                              </div>
                            )
                          )}
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            Submit Quiz
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {type === "assignment" && assignments.length > 0 && (
            <div>
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className={`cursor-pointer mb-4 p-4 rounded-lg ${
                    expandedAssignmentId === assignment._id
                      ? "bg-green-100 dark:bg-green-700"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {assignment.title}
                    </h2>
                    <button
                      onClick={() => toggleAssignmentDetails(assignment._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      {expandedAssignmentId === assignment._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>
                  {expandedAssignmentId === assignment._id && (
                    <div className="mt-4 space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Due Date:{" "}
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Marks: {assignment.totalMarks}
                      </p>
                      <button
                        onClick={() => handleSubmitAssignment(assignment._id)}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Submit Assignment
                      </button>
                      {/* Assignment Form */}
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">
                          Assignment Form
                        </h3>
                        <form>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Submission
                            </label>
                            <textarea
                              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                              rows={4}
                            ></textarea>
                          </div>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            Submit Assignment
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
