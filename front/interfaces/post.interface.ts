import { EMediaType } from "@/types/media.enum";
import { EVisibility } from "@/types/visibility.enum";
import { UserSummaryResponse } from "./user.interface";

export interface PostRequest {
  content: string;
  visibility: EVisibility;
  mediaFiles: File[];
}

export interface PostMediaResponse {
  id: number;
  url: string;
  type: EMediaType;
}

export interface PostResponse {
  id: number;
  content: string;
  createdAt: string;
  user: UserSummaryResponse;
  mediaList: PostMediaResponse[];
  totalReactions: number;
  totalComments: number;
  reactedByCurrentUser: boolean;
}
