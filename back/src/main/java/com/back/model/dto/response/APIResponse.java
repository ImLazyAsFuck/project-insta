package com.back.model.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class APIResponse<T>{
    private T data;
    private String message;
    private int status;
}
