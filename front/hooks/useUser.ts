import { ProfileResponse } from "@/interfaces/profile.interface";
import { searchUsersByUsername } from "@/services/user.service";
import { BaseResponse } from "@/utils/response-data";
import { useQuery } from "@tanstack/react-query";

const USER_KEY = ["user"];

export const useSearchUsersByUsernameQuery = (username: string) => {
  return useQuery<BaseResponse<ProfileResponse>>({
    queryKey: [...USER_KEY, "search", username],
    queryFn: () => searchUsersByUsername(username),
    enabled: username.trim().length > 0,
  });
};

