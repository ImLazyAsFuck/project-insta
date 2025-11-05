package com.back.service.refreshtoken;

import com.back.model.entity.RefreshToken;
import com.back.model.entity.User;
import com.back.repository.IRefreshTokenRepository;
import com.back.security.jwt.JWTProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements IRefreshTokenService {
    private final IRefreshTokenRepository refreshTokenRepository;
    private final JWTProvider jwtProvider;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);
        refreshTokenRepository.flush();
        String jwtToken = jwtProvider.generateRefreshToken(user.getEmail());

        LocalDateTime expiryLocalDateTime = jwtProvider.getExpiryDateFromToken(jwtToken)
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(jwtToken)
                .expiryDate(expiryLocalDateTime)
                .build();

        return refreshTokenRepository.save(token);
    }

    public boolean validateToken(String token) {
        if (!jwtProvider.validateToken(token)) return false;

        return refreshTokenRepository.findByToken(token)
                .filter(rt -> rt.getExpiryDate().isAfter(LocalDateTime.now(ZoneId.systemDefault())))
                .isPresent();
    }

    public User getUserByRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .map(RefreshToken::getUser)
                .orElse(null);
    }

    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
