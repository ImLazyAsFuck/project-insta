package com.back.utils.exception;

import com.back.model.dto.response.RegisterErrorResponse;
import lombok.Getter;

import java.util.List;

@Getter
public class CustomRegisterException extends RuntimeException {
    private final List<RegisterErrorResponse> errors;

    public CustomRegisterException(List<RegisterErrorResponse> errors) {
        super("Đăng ký thất bại");
        this.errors = errors;
    }

}
