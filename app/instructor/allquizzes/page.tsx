"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/config/api";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13
import { logout } from "@/app/utils/auth";
import { useTheme } from "@/app/providers/theme-providers";

export default function InstructorQuizCreationPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [quizRes, assignmentRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/quiz/quizzes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/quiz/assignments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!quizRes.ok || !assignmentRes.ok) {
          throw new Error("Failed to fetch data.");
        }

        const quizzesData = await quizRes.json();
        const assignmentsData = await assignmentRes.json();

        setQuizzes(quizzesData.quizzes || []);
        setAssignments(assignmentsData.assignments || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleQuizDetails = (quizId: string) => {
    setExpandedQuiz((prev) => (prev === quizId ? null : quizId));
  };

  const toggleAssignmentDetails = (assignmentId: string) => {
    setExpandedAssignment((prev) =>
      prev === assignmentId ? null : assignmentId
    );
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
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
                onClick={() => router.push("/instructor/dashboard")}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          View Quizzes and Assignments
        </h1>

        <div className="space-y-8">
          {/* Quizzes Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Quizzes
            </h2>
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {quiz.title}
                  </h3>
                  <button
                    onClick={() => toggleQuizDetails(quiz._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {expandedQuiz === quiz._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
                {expandedQuiz === quiz._id && (
                  <div className="mt-4 space-y-4">
                    {/* Quiz Details */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Quiz Details
                      </h4>
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Created By: {quiz.createdBy || "Unknown"}
                      </p>
                    </div>

                    {/* Quiz Submissions */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Submissions
                      </h4>
                      {quiz.submissions && quiz.submissions.length > 0 ? (
                        quiz.submissions.map((submission: any) => (
                          <div
                            key={submission.studentId}
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {submission.studentName} - {submission.score}%
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          No submissions yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Assignments Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Assignments
            </h2>
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {assignment.title}
                  </h3>
                  <button
                    onClick={() => toggleAssignmentDetails(assignment._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    {expandedAssignment === assignment._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
                {expandedAssignment === assignment._id && (
                  <div className="mt-4 space-y-4">
                    {/* Assignment Details */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Assignment Details
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Due Date:{" "}
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Marks: {assignment.totalMarks}
                      </p>
                    </div>

                    {/* Assignment Submissions */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Submissions
                      </h4>
                      {assignment.submissions &&
                      assignment.submissions.length > 0 ? (
                        assignment.submissions.map((submission: any) => (
                          <div
                            key={submission.studentId}
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {submission.studentName} - {submission.status}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          No submissions yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
