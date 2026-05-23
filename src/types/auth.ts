export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
}

export interface AuthState {
  token: string | null;
  user: User | null;
  persistSession: boolean;
  setAuth: (
    token: string,
    user: User,
    persistSession?: boolean,
  ) => void;
  logout: () => void;
}
