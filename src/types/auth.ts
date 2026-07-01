export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
}

export interface AuthState {
  access_token: string | null;
  token_type: string | null;
  refresh_token: string | null;
  user: User | null;
  persistSession: boolean;
  setAuth: (
    access_token: string,
    token_type: string,
    refresh_token: string,
    user: User,
    persistSession?: boolean,
  ) => void;
  logout: () => void;
}
