package com.back.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileRequest{
    private String fullName;

    @NotBlank(message = "Tên người dùng không được để trống")
    @Size(min = 3, max = 30, message = "Tên người dùng từ 3 đến 30 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9._]+$", message = "Tên người dùng chỉ chứa chữ, số, '.' hoặc '_'")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^0[3-9]\\d{8}$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phoneNumber;

    private String website;
    private String bio;

    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "Giới tính phải là MALE, FEMALE hoặc OTHER")
    private String gender;
}
