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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int RESET_TOKEN_LENGTH = 32;
    private static final int RESET_TOKEN_EXPIRY_HOURS = 1;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
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
        // Check if account exists first
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email. Please create an account."));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Incorrect password. Please try again.");
        }

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

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        // Silently return if user not found — prevents email enumeration
        if (user == null) {
            logger.info("Password reset requested for non-existent email: {}", email);
            return;
        }

        // Generate a cryptographically secure random token
        byte[] tokenBytes = new byte[RESET_TOKEN_LENGTH];
        secureRandom.nextBytes(tokenBytes);
        StringBuilder rawToken = new StringBuilder();
        for (byte b : tokenBytes) {
            rawToken.append(String.format("%02x", b));
        }
        String token = rawToken.toString();

        // Store the hashed token and expiry on the user
        user.setPasswordResetToken(passwordEncoder.encode(token));
        user.setPasswordResetExpiry(LocalDateTime.now().plusHours(RESET_TOKEN_EXPIRY_HOURS));
        userRepository.save(user);

        // Build reset link and send email
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetLink);

        logger.info("Password reset email sent to: {}", email);
    }

    public void resetPassword(String token, String newPassword) {
        // Find all users with non-expired reset tokens
        List<User> usersWithValidTokens = userRepository.findUsersWithValidResetToken(LocalDateTime.now());

        // Check if the raw token matches any stored hashed token
        User matchedUser = null;
        for (User user : usersWithValidTokens) {
            if (passwordEncoder.matches(token, user.getPasswordResetToken())) {
                matchedUser = user;
                break;
            }
        }

        if (matchedUser == null) {
            throw new RuntimeException("Invalid or expired password reset token. Please request a new one.");
        }

        // Update password and clear reset token
        matchedUser.setPasswordHash(passwordEncoder.encode(newPassword));
        matchedUser.setPasswordResetToken(null);
        matchedUser.setPasswordResetExpiry(null);
        userRepository.save(matchedUser);

        logger.info("Password successfully reset for user: {}", matchedUser.getEmail());
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
