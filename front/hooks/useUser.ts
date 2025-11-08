import { ProfileResponse } from "@/interfaces/profile.interface";
import { getProfileByUsername, searchUsersByUsername } from "@/services/user.service";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

const USER_KEY = ["user"];

export const useSearchUsersByUsernameQuery = (
  username: string
): UseQueryResult<BaseResponse<ProfileResponse>> => {
  const [debouncedUsername] = useDebounce(username.trim(), 400)

  return useQuery({
    queryKey: [...USER_KEY, "search", debouncedUsername],
    queryFn: async (): Promise<BaseResponse<ProfileResponse>> => {
      return await searchUsersByUsername(debouncedUsername)
    },
    enabled: debouncedUsername.length >= 2,
  })
}

export const useOtherProfileQuery = (username: string | undefined) => {
  return useQuery<SingleResponse<ProfileResponse>>({
    queryKey: [...USER_KEY, "other", username],
    queryFn: () => getProfileByUsername(username as string),
    enabled: Boolean(username),
  });
};