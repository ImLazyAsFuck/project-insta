package com.back.model.dto.request;

import com.back.model.enums.EVisibility;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostRequest{

    @Size(max = 500, message = "Nội dung không được quá 500 từ")
    private String content;

    @NotNull(message = "Chế độ hiển thị không được để trống")
    private EVisibility visibility;

    @Size(min = 1, message = "Cần ít nhất một file media")
    private List<MultipartFile> mediaFiles;
}
