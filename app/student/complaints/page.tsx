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
          className="w-full p-2 text-gray-900 border rounded-lg mb-4"
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
  const [sortBy, setSortBy] = useState<
    "Enroll" | "Withdraw" | "Completion" | "Other" | "All"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Resolved"
  >("All");
  const [dateFilter, setDateFilter] = useState<
    "All" | "today" | "week" | "month"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/student/`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/student/update-complaint/${id}`,
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getFilteredComplaints = () => {
    let filtered = [...complaints].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (sortBy !== "All") {
      filtered = filtered.filter((complaint) => complaint.type === sortBy);
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (complaint) => complaint.status === statusFilter
      );
    }

    if (dateFilter !== "All") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      filtered = filtered.filter((complaint) => {
        const complaintDate = new Date(complaint.createdAt);
        switch (dateFilter) {
          case "today":
            return complaintDate >= today;
          case "week":
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return complaintDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return complaintDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.studentDetails?.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredComplaints = getFilteredComplaints();
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const FilterButton = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
    >
      {children}
    </button>
  );

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
                onClick={() => router.push("/student/dashboard")}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-200"
              >
                Back to Dashboard
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
              Here you can raise and view your complaints.
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

        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Type Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <div className="flex gap-2">
                {["All", "Enroll", "Withdraw", "Completion", "Other"].map(
                  (type) => (
                    <FilterButton
                      key={type}
                      active={sortBy === type}
                      onClick={() => setSortBy(type as typeof sortBy)}
                    >
                      <span className="flex items-center gap-2">
                        {type === "All" && "👀"}
                        {type === "Enroll" && "📚"}
                        {type === "Withdraw" && "🔄"}
                        {type === "Completion" && "✅"}
                        {type === "Other" && "📝"}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </FilterButton>
                  )
                )}
              </div>
            </div>

            {/* Status Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <div className="flex gap-2">
                {["All", "Pending", "Resolved"].map((status) => (
                  <FilterButton
                    key={status}
                    active={statusFilter === status}
                    onClick={() =>
                      setStatusFilter(status as typeof statusFilter)
                    }
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Date Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <div className="flex gap-2">
                {[
                  { value: "all", label: "All Time" },
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                ].map((option) => (
                  <FilterButton
                    key={option.value}
                    active={dateFilter === option.value}
                    onClick={() =>
                      setDateFilter(option.value as typeof dateFilter)
                    }
                  >
                    {option.label}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Your Complaints</h3>
          {paginatedComplaints.length === 0 ? (
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
                      onClick={() =>
                        complaint.status !== "Resolved" &&
                        setEditComplaint(complaint)
                      }
                      className={`px-4 py-2 rounded-lg ${
                        complaint.status === "Resolved"
                          ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                          : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                      }`}
                      disabled={complaint.status === "Resolved"}
                      title={
                        complaint.status === "Resolved"
                          ? "Cannot edit a resolved complaint."
                          : ""
                      }
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        complaint.status !== "Resolved" &&
                        handleDeleteComplaint(complaint._id)
                      }
                      className={`px-4 py-2 rounded-lg ${
                        complaint.status === "Resolved"
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                      disabled={complaint.status === "Resolved"}
                      title={
                        complaint.status === "Resolved"
                          ? "Cannot delete a resolved complaint."
                          : ""
                      }
                    >
                      Delete
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
