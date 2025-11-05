package com.back.model.dto.request;

import com.back.model.enums.EGender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileRequest{
    private String fullName;
    private String username;
    private String website;
    private String bio;
    private String email;
    private String phoneNumber;
    private EGender gender;
    private MultipartFile avatarUrl;
}
