"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/theme-providers";
import { API_BASE_URL } from "@/app/config/api";

export default function InstructorQuizPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [type, setType] = useState<"quiz" | "assignment" | "">(""); // "" for initial step
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: [""], answerType: "descriptive" },
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string>(""); // New state for success message

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: [""], answerType: "descriptive" },
    ]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (qIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleDeleteOption = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, optionIndex) => optionIndex !== oIndex
    );
    setQuestions(updatedQuestions);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(""); // Reset success message before new submission

    const payload = {
      title,
      questions: JSON.stringify(questions),
      scheduleTime,
    };

    try {
      const token = localStorage.getItem("token"); // Assuming you store JWT in localStorage
      const response = await fetch(`${API_BASE_URL}/api/quiz/quizzes/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      // Success: Set the success message and navigate
      setSuccess("Quiz created successfully!");
      setTimeout(() => {
        router.push("/instructor/dashboard");
      }, 1500); // Redirect after 1.5 seconds
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = new FormData();
    payload.append("title", title);
    payload.append("description", description); // No need for JSON.stringify
    payload.append("dueDate", dueDate);
    if (file) {
      payload.append("file", file);
    }
    payload.append("instructor", "instructor_id"); // Replace with actual instructor ID
    payload.append("scheduleTime", scheduleTime);

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored here
      const response = await fetch(
        `${API_BASE_URL}/api/quiz/assignments/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
          body: payload, // Send the FormData payload
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create assignment");
      }

      setSuccess("Assignment created successfully!");
      setTimeout(() => {
        router.push("/instructor/dashboard");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Implement logout functionality here
    console.log("Logged out");
  };

  const handleBackToDashboard = () => {
    router.push("/instructor/dashboard");
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
            Create Quiz
          </button>
          <button
            onClick={() => setType("assignment")}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Create Assignment
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
            Create {type === "quiz" ? "Quiz" : "Assignment"}
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}{" "}
          {/* Success message */}
          <form
            onSubmit={
              type === "quiz" ? handleQuizSubmit : handleAssignmentSubmit
            }
          >
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            {type === "quiz" && (
              <>
                <div className="w-full h-2 bg-gray-200 rounded mb-4">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{
                      width: `${(questions.length / 10) * 100}%`,
                    }}
                  />
                </div>
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="mb-6">
                    <div className="flex justify-between items-center">
                      <label className="text-gray-700 dark:text-gray-300">
                        Question {qIndex + 1}
                      </label>
                      <div className="flex gap-2">
                        {/* <button
                          type="button"
                          onClick={() => handleDeleteQuestion(qIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete Question
                        </button> */}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    {q.options.map((opt, oIndex) => (
                      <div
                        key={oIndex}
                        className="flex justify-between items-center"
                      >
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                          className="w-full mt-2 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(qIndex, oIndex)}
                          className="mt-2 bg-red-500 text-white-500 hover:text-red-100 rounded-lg"
                        >
                          Delete Option
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() => handleAddOption(qIndex)}
                        className="px-4 py-2 bg-blue-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg"
                      >
                        Add Option
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(qIndex)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      >
                        Delete Question
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Add Question
                </button>
              </>
            )}
            {type === "assignment" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">
                    File Attachment
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  console.log("Save as Draft functionality pending")
                }
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
