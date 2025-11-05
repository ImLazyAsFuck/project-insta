import { ChangePassword, ProfileResponse } from "@/interfaces/profile.interface";
import { SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";
import { axiosInstance } from "@/utils/axios-instance";

export const getProfile = async (): Promise<SingleResponse<ProfileResponse>> => {
    try {
        const res = await axiosInstance.get("/accounts/profile");
        return res.data;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

// export const changePassword = async (changePassword: ChangePasswordRequest) => Promise<SinggleResponse<P>> {

// }