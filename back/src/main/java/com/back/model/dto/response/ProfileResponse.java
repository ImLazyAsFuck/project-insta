package com.back.model.dto.response;

import com.back.model.enums.EGender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponse{
    private String fullName;
    private String username;
    private String website;
    private String bio;
    private String email;
    private String phoneNumber;
    private EGender gender;
    private String avatarUrl;
}
