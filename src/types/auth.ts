export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
}

export interface AuthState {
  access_token: string | null;
  token_type: string | null;
  user: User | null;
  persistSession: boolean;
  setAuth: (
    access_token: string,
    token_type: string,
    user: User,
    persistSession?: boolean,
  ) => void;
  logout: () => void;
}
