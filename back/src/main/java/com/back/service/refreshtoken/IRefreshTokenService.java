package com.back.service.refreshtoken;

import com.back.model.entity.RefreshToken;
import com.back.model.entity.User;

public interface IRefreshTokenService{
    RefreshToken createRefreshToken(User user);
    boolean validateToken(String token);
    User getUserByRefreshToken(String token);
    void deleteByUser(User user);
}
