package com.back.security.config;

import com.back.utils.exception.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JWTAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        int status = HttpServletResponse.SC_UNAUTHORIZED;
        String message;
        String error = "Unauthorized";

        if (authException instanceof BadCredentialsException) {
            message = "Tài khoản hoặc mật khẩu không đúng.";
        } else if (authException instanceof InsufficientAuthenticationException) {
            message = "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn";
        } else if (authException.getCause() instanceof ExpiredJwtException) {
            message = "JWT đã hết hạn, vui lòng đăng nhập lại.";
        } else if (authException.getCause() instanceof SignatureException) {
            message = "Chữ ký token không hợp lệ.";
        } else {
            message = "Truy cập bị từ chối do thông tin xác thực không hợp lệ hoặc thiếu.";
        }

        ErrorResponse errorResponse = ErrorResponse.builder()
                .message(message)
                .error(error)
                .status(status)
                .build();
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(status);
        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
