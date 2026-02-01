package com.hospitalapp.backend.service;

import com.hospitalapp.backend.dto.auth.AuthResponse;
import com.hospitalapp.backend.dto.auth.LoginRequest;
import com.hospitalapp.backend.dto.auth.RefreshTokenRequest;
import com.hospitalapp.backend.dto.auth.RegisterRequest;
import com.hospitalapp.backend.model.User;
import com.hospitalapp.backend.repository.UserRepository;
import com.hospitalapp.backend.security.CustomUserDetailsService;
import com.hospitalapp.backend.security.JwtService;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(User.Role.PATIENT);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        CustomUserDetailsService.CustomUserDetails userDetails =
                new CustomUserDetailsService.CustomUserDetails(savedUser);

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return createAuthResponse(savedUser, accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomUserDetailsService.CustomUserDetails userDetails =
                new CustomUserDetailsService.CustomUserDetails(user);

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return createAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtService.canTokenBeRefreshed(refreshToken)) {
            throw new JwtException("Invalid or expired refresh token");
        }

        String username = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomUserDetailsService.CustomUserDetails userDetails =
                new CustomUserDetailsService.CustomUserDetails(user);

        String newAccessToken = jwtService.refreshAccessToken(refreshToken, userDetails);
        String newRefreshToken = jwtService.generateRefreshToken(userDetails);

        return createAuthResponse(user, newAccessToken, newRefreshToken);
    }

    private AuthResponse createAuthResponse(User user, String accessToken, String refreshToken) {
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name(),
                user.getPhoneNumber()
        );

        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessTokenExpiration(),
                jwtService.getRefreshTokenExpiration(),
                userInfo
        );
    }
}
