package com.back.model.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentRequest{

    @NotBlank(message = "Vui lòng nhập nội dung")
    @Size(max = 500, message = "Vui lòng không nhập quá 500 ký tự")
    private String content;

    private Long parentId;
    private Long postId;
}
