package com.back.model.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class APIResponse<T>{
    private T data;
    private PaginationResponse meta;
    private String message;
    private int status;

    public static <T> APIResponse<T> success(T data) {
        return APIResponse.<T>builder()
                .data(data)
                .message("Success")
                .status(200)
                .build();
    }

    public static <T> APIResponse<T> successWithMeta(T data, int currentPage, int pageSize, int totalPages, long totalItems) {
        return APIResponse.<T>builder()
                .data(data)
                .message("Success")
                .status(200)
                .meta(new PaginationResponse(currentPage, pageSize, totalPages, totalItems))
                .build();
    }

}
