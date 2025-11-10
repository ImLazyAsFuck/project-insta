package com.back.model.dto.response;

import com.back.model.enums.EReactionType;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageReactionResponse{
    private Long id;
    private Long userId;
    private String username;
    private EReactionType type;
}
