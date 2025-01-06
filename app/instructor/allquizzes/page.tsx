"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";

export default function InstructorSubmissionsPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const viewSubmissions = (type: "quiz" | "assignment", id: string) => {
    router.push(`/instructor/submissions/${type}/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          View Quizzes and Assignments
        </h1>
        {quizzes.length === 0 && assignments.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-400">
            No quizzes or assignments created.
          </p>
        ) : (
          <div className="space-y-8">
            {/* Quizzes Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Quizzes
              </h2>
              {quizzes.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-400">
                  No quizzes created yet.
                </p>
              ) : (
                <div className="grid gap-4">
                  {quizzes.map((quiz: any) => (
                    <div
                      key={quiz._id}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Scheduled Time:{" "}
                        {new Date(quiz.scheduleTime).toLocaleString()}
                      </p>
                      <button
                        onClick={() => viewSubmissions("quiz", quiz._id)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        View Submissions
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assignments Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Assignments
              </h2>
              {assignments.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-400">
                  No assignments created yet.
                </p>
              ) : (
                <div className="grid gap-4">
                  {assignments.map((assignment: any) => (
                    <div
                      key={assignment._id}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Due Date:{" "}
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() =>
                          viewSubmissions("assignment", assignment._id)
                        }
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        View Submissions
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
