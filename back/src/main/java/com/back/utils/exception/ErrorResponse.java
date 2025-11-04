package com.back.utils.exception;

import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Builder
public class ErrorResponse{
    private String message;
    String error;
    int status;
}
