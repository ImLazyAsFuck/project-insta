import { Gender } from "@/enums/gender.enum";

export interface ProfileRequestDTO {
  fullName?: string;
  username: string;
  email: string;
  phoneNumber: string;
  website?: string;
  bio?: string;
  gender: Gender;
}

export interface ProfileResponse {
  id: number;
  fullName: string;
  username: string;
  website: string;
  bio: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  avatarUrl: string;
  followersCount: number;
  followingCount: number;
  postCount: number;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface FollowRequestResponse extends ProfileResponse {
  followId: number;
}