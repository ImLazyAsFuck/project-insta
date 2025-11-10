package com.back.model.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageRequestDTO {
    private Long conversationId;
    private Long senderId;
    private String content;
    private List<MultipartFile> mediaUrl;
}
