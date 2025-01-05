"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/theme-providers";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { User } from "@/app/types/user";

interface ComplaintType {
  _id: string;
  description: string;
  status: "Pending" | "Resolved";
  type: "Enroll" | "Withdraw" | "Completion" | "Other" | "all";
  studentDetails: {
    firstName: string;
    roomNumber: string;
  };
  createdAt: string;
}

interface EditModalProps {
  complaint: ComplaintType;
  onClose: () => void;
  onUpdate: (id: string, description: string) => Promise<void>;
}

const EditModal: React.FC<EditModalProps> = ({
  complaint,
  onClose,
  onUpdate,
}) => {
  const [description, setDescription] = useState(complaint.description);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onUpdate(complaint._id, description);
      onClose();
    } catch (err) {
      setError("Failed to update complaint");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Complaint</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ComplaintsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [complaints, setComplaints] = useState<ComplaintType[]>([]);
  const [newComplaint, setNewComplaint] = useState("");
  const [newComplaintType, setNewComplaintType] = useState<
    "Enroll" | "Withdraw" | "Completion" | "Other"
  >("Other");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user] = useState<User | null>(getUser() as User | null);
  const [editComplaint, setEditComplaint] = useState<ComplaintType | null>(
    null
  );

  useEffect(() => {
    if (!user || !hasRole(["student"])) {
      router.push("/login");
      return;
    }

    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/student`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setComplaints(response.data.complaints);
        } else {
          setError(response.data.message || "Error fetching complaints");
        }
      } catch (error) {
        setError("Failed to fetch complaints");
      }
    };

    fetchComplaints();
  }, [router, user]);

  const handleCreateComplaint = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/create`,
        {
          description: newComplaint,
          type: newComplaintType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComplaints((prev) => [response.data.complaint, ...prev]);
        setNewComplaint("");
        setNewComplaintType("Other");
      } else {
        setError(response.data.message || "Error creating complaint");
      }
    } catch (error) {
      setError("Failed to create complaint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComplaint = async (id: string, description: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/student/${id}`,
        { description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComplaints((prev) =>
          prev.map((complaint) =>
            complaint._id === id ? response.data.complaint : complaint
          )
        );
      } else {
        setError(response.data.message || "Error updating complaint");
      }
    } catch (error) {
      setError("Failed to update complaint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/student/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComplaints((prev) =>
          prev.filter((complaint) => complaint._id !== id)
        );
      } else {
        setError(response.data.message || "Error deleting complaint");
      }
    } catch (error) {
      setError("Failed to delete complaint");
    } finally {
      setIsLoading(false);
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
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Your Complaints</h2>
            <p className="text-blue-100">
              Here you can view and manage your complaints.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Submit a New Complaint</h3>

          <div className="flex gap-2 mb-4">
            {[
              { label: "Enroll", icon: "📘" },
              { label: "Withdraw", icon: "🔄" },
              { label: "Completion", icon: "✅" },
              { label: "Other", icon: "📝" },
            ].map(({ label, icon }) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  setNewComplaintType(
                    label as "Enroll" | "Withdraw" | "Completion" | "Other"
                  )
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  newComplaintType === label
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <textarea
            value={newComplaint}
            onChange={(e) => setNewComplaint(e.target.value)}
            className="w-full text-gray-900 p-2 border rounded-lg mb-4"
            placeholder="Describe your complaint"
          />
          <button
            onClick={handleCreateComplaint}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Your Complaints</h3>
          {complaints.length === 0 ? (
            <p className="text-gray-500">No complaints found.</p>
          ) : (
            <ul className="space-y-4">
              {complaints.map((complaint) => (
                <li
                  key={complaint._id}
                  className="p-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      {complaint.type === "Enroll" && "📘"}
                      {complaint.type === "Withdraw" && "🔄"}
                      {complaint.type === "Completion" && "✅"}
                      {complaint.type === "Other" && "📝"}
                      {complaint.type} Complaint
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${
                        complaint.status === "Resolved"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {complaint.description}
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditComplaint(complaint)}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComplaint(complaint._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {editComplaint && (
        <EditModal
          complaint={editComplaint}
          onClose={() => setEditComplaint(null)}
          onUpdate={handleUpdateComplaint}
        />
      )}
    </div>
  );
}
