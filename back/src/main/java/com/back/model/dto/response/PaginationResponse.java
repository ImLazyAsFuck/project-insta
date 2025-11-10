package com.back.model.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginationResponse{
    private int currentPage;
    private int pageSize;
    private int totalPages;
    private long totalItems;
}
