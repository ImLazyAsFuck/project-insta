import { ErrorResponse } from "@/utils/error-response";
import { isAxiosError } from "axios";

export const handleAxiosError = (error: any): ErrorResponse => {
  if (isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as Partial<ErrorResponse>;
      return {
        message: data.message || "An error occurred",
        error: data.error || "Server Error",
        status: data.status || error.response.status || 500,
      };
    }
    if (error.request) {
      return {
        message: "No response from server",
        error: "Network Error",
        status: 503,
      };
    }
    return {
      message: error.message || "Unknown Axios error",
      error: "AxiosError",
      status: 500,
    };
  }
  return {
    message: (error && error.message) || "Unexpected error occurred",
    error: "Unhandled",
    status: 500,
  };
};
