import { ProfileResponse } from "@/interfaces/profile.interface";
import {
  blockUser,
  fetchBlockedUsers,
  unblockUser,
} from "@/services/block.service";
import { BaseResponse } from "@/utils/response-data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BLOCK_KEY = ["block"];

export const useBlockedUsersQuery = () => {
  return useQuery<BaseResponse<ProfileResponse>>({
    queryKey: [...BLOCK_KEY, "users"],
    queryFn: fetchBlockedUsers,
  });
};

export const useBlockUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => blockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...BLOCK_KEY, "users"] });
      queryClient.invalidateQueries({ queryKey: ["account", "profile"] });
    },
  });
};

export const useUnblockUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...BLOCK_KEY, "users"] });
      queryClient.invalidateQueries({ queryKey: ["account", "profile"] });
    },
  });
};
