import { User } from "@/app/types/user";

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const hasRole = (allowedRoles: string[]) => {
  const user = getUser();
  return user && allowedRoles.includes(user.role);
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
};
