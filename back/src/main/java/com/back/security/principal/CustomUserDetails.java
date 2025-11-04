package com.back.security.principal;

import com.back.model.entity.User;
import com.back.model.enums.EGender;
import com.back.model.enums.EUserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@AllArgsConstructor
@Getter
@Builder
public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String username;
    private final String password;
    private final String name;
    private final String email;
    private final String phoneNumber;
    private final String avatarUrl;
    private final String bio;
    private final String website;
    private final EUserStatus status;
    private final EGender gender;

    private final Collection<? extends GrantedAuthority> authorities;

    public static CustomUserDetails fromUserEntityToCustomUserDetails(User user) {
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(user.getRole().getName().name())
        );

        return CustomUserDetails.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword())
                .name(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .website(user.getWebsite())
                .status(user.getStatus())
                .authorities(authorities)
                .build();
    }

    @Override
    public boolean isAccountNonExpired() {
        return status != EUserStatus.INACTIVE;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != EUserStatus.BLOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == EUserStatus.ACTIVE;
    }

    public boolean hasRole(String role) {
        return authorities.stream()
                .anyMatch(authority -> authority.getAuthority().equals(role) ||
                        authority.getAuthority().equals(role));
    }
}
