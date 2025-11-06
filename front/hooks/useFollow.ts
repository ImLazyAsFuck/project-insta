import { ProfileResponse } from "@/interfaces/profile.interface";
import {
  acceptFollowRequest,
  fetchFollowRequests,
  fetchFollowers,
  fetchFollowings,
  rejectFollowRequest,
  removeFollow,
  sendFollowRequest,
} from "@/services/follow.service";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FOLLOW_KEY = ["follow"];

export const useFollowRequestsQuery = () => {
  return useQuery<BaseResponse<ProfileResponse>>({
    queryKey: [...FOLLOW_KEY, "requests"],
    queryFn: fetchFollowRequests,
  });
};

export const useFollowersQuery = () => {
  return useQuery<BaseResponse<ProfileResponse>>({
    queryKey: [...FOLLOW_KEY, "followers"],
    queryFn: fetchFollowers,
  });
};

export const useFollowingsQuery = () => {
  return useQuery<BaseResponse<ProfileResponse>>({
    queryKey: [...FOLLOW_KEY, "following"],
    queryFn: fetchFollowings,
  });
};

export const useSendFollowRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followingId: number) => sendFollowRequest(followingId),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [...FOLLOW_KEY, "requests"] });
      queryClient.invalidateQueries({ queryKey: [...FOLLOW_KEY, "followers"] });
      queryClient.invalidateQueries({ queryKey: [...FOLLOW_KEY, "following"] });
      queryClient.invalidateQueries({ queryKey: ["account", "profile"] });
    },
  });
};

export const useAcceptFollowRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followId: number) => acceptFollowRequest(followId),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [...FOLLOW_KEY, "requests"] });
      queryClient.invalidateQueries({ queryKey: [...FOLLOW_KEY, "followers"] });
      queryClient.invalidateQueries({ queryKey: [...FOLLOW_KEY, "following"] });
      queryClient.invalidateQueries({ queryKey: ["account", "profile"] });
    },
  });
};

export const useRejectFollowRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followId: number) => rejectFollowRequest(followId),
    onSuccess: () => {
      // Invalidate follow requests list
      queryClient.invalidateQueries({ queryKey: [...FOLLOW_KEY, "requests"] });
    },
  });
};

export const useRemoveFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followId: number) => removeFollow(followId),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [...FOLLOW_KEY, "followers"] });
      queryClient.invalidateQueries({ queryKey: [...FOLLOW_KEY, "following"] });
      queryClient.invalidateQueries({ queryKey: ["account", "profile"] });
    },
  });
};

