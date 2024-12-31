import { useState } from "react";

type Course = {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  capacity: number;
  isEnrolled: boolean;
};

type CourseCardProps = {
  course: Course;
};

export const CourseCard = ({ course }: CourseCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEnroll = async () => {
    if (isSubmitting || course.isEnrolled) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Successfully enrolled in the course!");
      } else {
        setMessage(data.message || "Error enrolling in the course");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg shadow-lg transition ${
        course.isEnrolled ? "border-green-500 bg-green-50 dark:bg-green-800/20" : "border-gray-200 dark:border-gray-700"
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

      {message && (
        <div className={`mt-2 p-2 rounded ${message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {message}
        </div>
      )}

      <button
        className={`mt-4 px-6 py-2 text-white font-semibold rounded-lg ${
          isSubmitting || course.isEnrolled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } transition`}
        onClick={handleEnroll}
        disabled={isSubmitting || course.isEnrolled}
      >
        {isSubmitting ? "Enrolling..." : course.isEnrolled ? "Enrolled" : "Enroll"}
      </button>
    </div>
  );
};
