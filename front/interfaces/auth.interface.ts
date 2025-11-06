import { UserStatus } from "@/enums/user-status.enum";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  username: string;
  phoneNumber: string;
}

export interface JWTResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  bio: string | null;
  website: string | null;
  phoneNumber: string;
  avatarUrl: string | null;
  status: UserStatus;
}
