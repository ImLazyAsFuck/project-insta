package com.back.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequestDTO {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
            message = "Mật khẩu phải chứa ít nhất 1 chữ cái, 1 số, 1 ký tự đặc biệt và tối thiểu 8 ký tự"
    )
    private String password;

    private String fullName;

    @NotBlank(message = "Tên người dùng không được để trống")
    @Size(min = 3, max = 30, message = "Tên người dùng phải có độ dài từ 3 đến 30 ký tự")
    private String username;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^0[3-9]\\d{8}$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phoneNumber;
}
