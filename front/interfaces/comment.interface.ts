import { UserSummaryResponse } from "./user.interface";

export interface CommentResponse {
  id: number;
  content: string;
  user: UserSummaryResponse;
  replyToUsername?: string | null;
  parentId?: number | null;
  reactionCount: number;
  reactedByCurrentUser: boolean;
  createdAt: string;
  childComments: CommentResponse[];
}

export interface CommentRequest {
  content: string;
  parentId?: number | null;
  postId?: number | null;
}
