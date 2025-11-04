package com.back.security.jwt;

import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Slf4j
public class JWTProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expire}")
    private long jwtExpire;
    @Value("${jwt.refresh}")
    private long jwtRefresh;

    public String generateAccessToken(String email) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpire);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public boolean validateToken(String token){
        try{
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        }catch (ExpiredJwtException e){
            log.error("JWT token hết hạn!");
        }catch (UnsupportedJwtException e){
            log.error("JWT token không hỗ trợ!");
        }catch (MalformedJwtException e){
            log.error("JWT token không đúng kiểu!");
        }catch (SignatureException e){
            log.error("JWT token có lỗi chữ ký!");
        }catch (IllegalArgumentException e){
            log.error("JWT token không hợp lệ hoặc rỗng!");
    }
        return false;
    }

    public String getUsernameFromToken(String token){
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public String refreshToken(String token, String username){
        if(validateToken(token) && getUsernameFromToken(token).equals(username)){
            Date now = new Date();
            return Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(now)
                    .setExpiration(new Date(now.getTime() + jwtRefresh))
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();
        }
        return null;
    }

    public String extractToken(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        if(bearerToken != null && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7);
        }
        return null;
    }

    public String generateRefreshToken(String username){
        Date now = new Date();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + jwtRefresh))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public Date getExpiryDateFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

}