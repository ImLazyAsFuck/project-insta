package com.back.model.dto.response;

import com.back.model.enums.EMediaType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostMediaResponse {
    private Long id;
    private String url;
    private EMediaType type;
}
