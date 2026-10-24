package com.preppal.controller;

import com.preppal.dto.ProfileResponse;
import com.preppal.dto.ProfileUpdateRequest;
import com.preppal.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller exposing authenticated Student Profile endpoints.
 * All operations require a valid JWT Bearer token.
 * Ownership is enforced server-side using the authenticated principal.
 */
@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * GET /api/v1/profile/me
     * Fetches the current authenticated student's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        ProfileResponse response = profileService.getProfile(email);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/v1/profile/me
     * Creates or updates the current authenticated student's profile.
     */
    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request) {
        String email = authentication.getName();
        ProfileResponse response = profileService.updateProfile(email, request);
        return ResponseEntity.ok(response);
    }
}
