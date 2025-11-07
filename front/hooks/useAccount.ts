import {
  ChangePasswordRequest,
  ProfileRequestDTO,
  ProfileResponse,
} from "@/interfaces/profile.interface";
import {
  changePassword,
  getProfile,
  updateProfile,
  uploadAvatar,
} from "@/services/account.service";
import { SingleResponse } from "@/utils/response-data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PROFILE_KEY = ["account", "profile"];

export const useProfileQuery = () => {
  return useQuery<SingleResponse<ProfileResponse>>({
    queryKey: PROFILE_KEY,
    queryFn: getProfile,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileRequestDTO) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileUri: string) => uploadAvatar(fileUri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    },
  });
};
