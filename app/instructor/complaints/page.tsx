"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/theme-providers";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { User } from "@/app/types/user";

interface ComplaintType {
  _id: string;
  description: string;
  status: "Pending" | "Resolved";
  type: "Enroll" | "Withdraw" | "Completion" | "Other" | "All";
  studentDetails: {
    firstName: string;
    roomNumber: string;
  };
  createdAt: string;
}

export default function ComplaintsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [complaints, setComplaints] = useState<ComplaintType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState<User | null>(getUser() as User | null);
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
    const checkAuthAndFetch = async () => {
      if (!user || !hasRole(["instructor"])) {
        router.push("/login");
        return;
      }
      await fetchComplaints();
    };

    checkAuthAndFetch();
  }, [user, router]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/instructor/complaints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      }
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComplaint = async (
    complaintId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/instructor/update-complaint/${complaintId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Resolved" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve complaint");
      }

      // Remove focus from the button
      event.currentTarget.blur();

      // Update the complaint status in the state
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId
            ? { ...complaint, status: "Resolved" }
            : complaint
        )
      );
    } catch (error) {
      console.error("Failed to resolve complaint:", error);
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

  const getSortedComplaints = () => {
    if (sortBy === "All") return complaints;
    return complaints.filter((complaint) => complaint.type === sortBy);
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

  if (!user) return null;

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
                onClick={() => router.push("/instructor/dashboard")}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Student Complaints 📝</h2>
            <p className="text-blue-100">
              View and manage all student complaints in one place
            </p>
          </div>
        </div>

        {/* Filter Section */}
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

        {/* Complaints Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              {paginatedComplaints.length > 0 ? (
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedComplaints.map((complaint, index) => (
                    <tr
                      key={`${complaint._id}-${index}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {complaint.studentDetails?.firstName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                          {complaint.type === "All" && "👀"}
                          {complaint.type === "Enroll" && "📚"}
                          {complaint.type === "Withdraw" && "🔄"}
                          {complaint.type === "Completion" && "✅"}
                          {complaint.type === "Other" && "📝"}
                          {complaint.type.charAt(0).toUpperCase() +
                            complaint.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-md truncate">
                        {complaint.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {complaint.status === "Pending" && (
                          <button
                            onClick={(event) =>
                              handleResolveComplaint(complaint._id, event)
                            }
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No complaints found
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
