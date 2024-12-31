export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "admin" | "student" | "instructor";
  courses?: string[];
  complaint: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Session interface for authenticated user session
export interface UserSession {
  user: User | null; // Include User object for logged-in user
  isLoading: boolean;
}
