// interface User {
//     id: string;
//     email: string;
//     role: "admin" | "instructor" | "student" | "portfolio";
//     firstName: string;
//     lastName: string;
//   }

//   export const getUser = (): User | null => {
//     if (typeof window === "undefined") return null;

//     const userStr = localStorage.getItem("user");
//     if (!userStr) return null;

//     try {
//       return JSON.parse(userStr);
//     } catch {
//       return null;
//     }
//   };

//   export const getToken = (): string | null => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("token");
//   };

//   export const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   export const isAuthenticated = (): boolean => {
//     return !!getToken() && !!getUser();
//   };

//   export const hasRole = (allowedRoles: string[]): boolean => {
//     const user = getUser();
//     return user ? allowedRoles.includes(user.role) : false;
//   };

//   export const checkRouteAccess = (pathname: string): boolean => {
//     const user = getUser();
//     if (!user) return false;

//     const roleAccess = {
//       student: ["/student/dashboard"],
//       instructor: ["/instructor/dashboard"],
//       portfolio: ["/portfolio/dashboard"],
//       admin: ["/admin/dashboard", "/student/dashboard", "/instructor/dashboard", "/portfolio/dashboard"],
//     };

//     const allowedRoutes = roleAccess[user.role as keyof typeof roleAccess] || [];
//     return allowedRoutes.some((route) => pathname.startsWith(route));
//   };

interface User {
  id: string;
  email: string;
  role: "admin" | "instructor" | "student" | "portfolio";
  username: string;
  firstName: string;
  lastName: string;
}

// Get the user object from localStorage
export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Get the token from localStorage
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Logout function with role-based redirects
export const logout = () => {
  const user = getUser(); // Retrieve the current user to check their role

  // Clear user and token from localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  // Define custom logout redirects based on user roles
  const roleRedirectMap: Record<string, string> = {
    admin: "/admin/logout", // Custom admin logout page
    instructor: "/instructor", // Instructor-specific home or login
    student: "/student", // Student-specific home or login
    portfolio: "/portfolio", // Custom portfolio page
  };

  // Default to the login page if no role or match found
  const redirectPath = user?.role ? roleRedirectMap[user.role] : "/login";

  // Redirect the user after logout
  window.location.href = redirectPath;
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};

// Check if the user has a specific role
export const hasRole = (allowedRoles: string[]): boolean => {
  const user = getUser();
  return user ? allowedRoles.includes(user.role) : false;
};

// Check if a route is accessible based on user role
export const checkRouteAccess = (pathname: string): boolean => {
  const user = getUser();
  if (!user) return false;

  // Define role-based access to routes
  const roleAccess = {
    student: ["/student/dashboard"],
    instructor: ["/instructor/dashboard"],
    portfolio: ["/portfolio/dashboard"],
    admin: [
      "/admin/dashboard",
      "/student/dashboard",
      "/instructor/dashboard",
      "/portfolio/dashboard",
    ],
  };

  // Check if the current route starts with an allowed path
  const allowedRoutes = roleAccess[user.role as keyof typeof roleAccess] || [];
  return allowedRoutes.some((route) => pathname.startsWith(route));
};
