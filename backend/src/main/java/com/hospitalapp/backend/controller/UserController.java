package com.hospitalapp.backend.controller;

import com.hospitalapp.backend.dto.user.ChangePasswordRequest;
import com.hospitalapp.backend.dto.user.CreateUserRequest;
import com.hospitalapp.backend.dto.user.UpdateProfileRequest;
import com.hospitalapp.backend.dto.user.UpdateUserRequest;
import com.hospitalapp.backend.dto.user.UserResponse;
import com.hospitalapp.backend.security.CustomUserDetailsService;
import com.hospitalapp.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean activeOnly) {

        List<UserResponse> users;

        if (search != null && !search.isEmpty()) {
            users = userService.searchUsers(search);
        } else if (role != null && !role.isEmpty()) {
            users = userService.getUsersByRole(role);
        } else if (Boolean.TRUE.equals(activeOnly)) {
            users = userService.getActiveUsers();
        } else {
            users = userService.getAllUsers();
        }

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> toggleUserStatus(@PathVariable Long id) {
        UserResponse user = userService.toggleUserStatus(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getUserStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userService.countAllUsers());
        stats.put("totalPatients", userService.countByRole("PATIENT"));
        stats.put("totalDoctors", userService.countByRole("DOCTOR"));
        stats.put("totalAdmins", userService.countByRole("ADMIN"));
        stats.put("activePatients", userService.countActiveByRole("PATIENT"));
        stats.put("activeDoctors", userService.countActiveByRole("DOCTOR"));
        stats.put("activeAdmins", userService.countActiveByRole("ADMIN"));
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/me/profile")
    public ResponseEntity<UserResponse> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetailsService.CustomUserDetails currentUser,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse user = userService.updateProfile(currentUser.getUserId(), request);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> changeMyPassword(
            @AuthenticationPrincipal CustomUserDetailsService.CustomUserDetails currentUser,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(currentUser.getUserId(), request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }
}
