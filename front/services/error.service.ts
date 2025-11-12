import { ErrorResponse } from "@/utils/error-response";
import { isAxiosError } from "axios";

export const handleAxiosError = (error: any): ErrorResponse => {
  if (isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data;
      
      if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        "error" in data &&
        "status" in data
      ) {
        return {
          message: data.message || "An error occurred",
          error: data.error || "Server Error",
          status: data.status || error.response.status || 500,
        };
      }
      
      return {
        message: data?.message || "An error occurred",
        error: data?.error || typeof data === "string" ? data : "Server Error",
        status: error.response.status || 500,
      };
    }
    
    if (error.request) {
      return {
        message: "Không thể kết nối đến server",
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
  
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    "error" in error &&
    "status" in error
  ) {
    return error as ErrorResponse;
  }
  
  return {
    message: (error && error.message) || "Unexpected error occurred",
    error: "Unhandled",
    status: 500,
  };
};
