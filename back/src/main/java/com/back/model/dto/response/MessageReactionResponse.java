package com.back.model.dto.request;

import com.back.model.enums.EReactionType;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageReactionRequest{
    private Long id;
    private Long userId;
    private String username;
    private EReactionType type;
}
