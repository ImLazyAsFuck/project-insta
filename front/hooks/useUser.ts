import { ProfileResponse } from "@/interfaces/profile.interface";
import { getProfileByUsername, searchUsersByUsername } from "@/services/user.service";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { useQuery } from "@tanstack/react-query";

const USER_KEY = ["user"];

export const useSearchUsersByUsernameQuery = (username: string) => {
  return useQuery<BaseResponse<ProfileResponse>>({
    queryKey: [...USER_KEY, "search", username],
    queryFn: () => searchUsersByUsername(username),
    enabled: username.trim().length > 0,
  });
};

export const useOtherProfileQuery = (username: string | undefined) => {
  return useQuery<SingleResponse<ProfileResponse>>({
    queryKey: [...USER_KEY, "other", username],
    queryFn: () => getProfileByUsername(username as string),
    enabled: Boolean(username),
  });
};