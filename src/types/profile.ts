import type { User } from "@/types/auth";

/** Extended user profile returned by GET /api/v1/auth/me */
export interface UserProfile extends User {
  profile_picture: string | null;
  created_at: string;
  last_login: string | null;
}
