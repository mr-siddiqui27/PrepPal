package com.preppal.service;

import com.preppal.dto.ProfileResponse;
import com.preppal.dto.ProfileUpdateRequest;
import com.preppal.exception.ResourceNotFoundException;
import com.preppal.model.StudentProfile;
import com.preppal.model.User;
import com.preppal.repository.StudentProfileRepository;
import com.preppal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing Student Profile operations.
 * Enforces ownership by resolving the student entity through the authenticated email.
 */
@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;

    public ProfileService(UserRepository userRepository,
                          StudentProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    /**
     * Retrieves the profile for the authenticated user.
     * If the student has not yet created a profile, an initial profile response
     * pre-populated with their account details is returned.
     */
    public ProfileResponse getProfile(String email) {
        User user = findUserByEmail(email);

        return profileRepository.findByUserId(user.getId())
                .map(profile -> toResponse(user, profile))
                .orElseGet(() -> toInitialResponse(user));
    }

    /**
     * Creates or updates the profile for the authenticated user.
     */
    public ProfileResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = findUserByEmail(email);

        StudentProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> new StudentProfile(user.getId(), user.getEmail()));

        // Update academic information
        profile.setCollegeName(trimToNull(request.getCollegeName()));
        profile.setDegree(trimToNull(request.getDegree()));
        profile.setBranch(trimToNull(request.getBranch()));
        profile.setGraduationYear(request.getGraduationYear());

        // Update technical skills
        profile.setProgrammingLanguages(cleanList(request.getProgrammingLanguages()));
        profile.setTechnicalSkills(cleanList(request.getTechnicalSkills()));
        profile.setFrameworks(cleanList(request.getFrameworks()));
        profile.setToolsAndDatabases(cleanList(request.getToolsAndDatabases()));

        // Update career preferences
        profile.setCareerGoal(trimToNull(request.getCareerGoal()));
        profile.setPreferredRoles(cleanList(request.getPreferredRoles()));
        profile.setCareerInterests(cleanList(request.getCareerInterests()));
        profile.setTargetCompanies(cleanList(request.getTargetCompanies()));
        profile.setPreferredTechnologies(cleanList(request.getPreferredTechnologies()));

        // Update profile media
        if (request.getProfilePictureUrl() != null) {
            profile.setProfilePictureUrl(trimToNull(request.getProfilePictureUrl()));
        }

        profile.setUpdatedAt(Instant.now());

        // Optionally update display full name on user account if provided
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        StudentProfile saved = profileRepository.save(profile);

        return toResponse(user, saved);
    }

    private User findUserByEmail(String email) {
        String normalizedEmail = (email != null) ? email.toLowerCase().trim() : "";
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private ProfileResponse toResponse(User user, StudentProfile profile) {
        ProfileResponse res = new ProfileResponse();
        res.setId(profile.getId());
        res.setUserId(user.getId());
        res.setFullName(user.getFullName());
        res.setEmail(user.getEmail());

        res.setCollegeName(profile.getCollegeName());
        res.setDegree(profile.getDegree());
        res.setBranch(profile.getBranch());
        res.setGraduationYear(profile.getGraduationYear());

        res.setProgrammingLanguages(profile.getProgrammingLanguages());
        res.setTechnicalSkills(profile.getTechnicalSkills());
        res.setFrameworks(profile.getFrameworks());
        res.setToolsAndDatabases(profile.getToolsAndDatabases());

        res.setCareerGoal(profile.getCareerGoal());
        res.setPreferredRoles(profile.getPreferredRoles());
        res.setCareerInterests(profile.getCareerInterests());
        res.setTargetCompanies(profile.getTargetCompanies());
        res.setPreferredTechnologies(profile.getPreferredTechnologies());

        res.setProfilePictureUrl(profile.getProfilePictureUrl());

        res.setCreatedAt(profile.getCreatedAt());
        res.setUpdatedAt(profile.getUpdatedAt());

        boolean hasAcademic = profile.getCollegeName() != null || profile.getDegree() != null;
        boolean hasSkills = !profile.getProgrammingLanguages().isEmpty() || !profile.getTechnicalSkills().isEmpty();
        res.setCompleted(hasAcademic || hasSkills);

        return res;
    }

    private ProfileResponse toInitialResponse(User user) {
        ProfileResponse res = new ProfileResponse();
        res.setId(null);
        res.setUserId(user.getId());
        res.setFullName(user.getFullName());
        res.setEmail(user.getEmail());
        res.setProfilePictureUrl(null);

        res.setProgrammingLanguages(new ArrayList<>());
        res.setTechnicalSkills(new ArrayList<>());
        res.setFrameworks(new ArrayList<>());
        res.setToolsAndDatabases(new ArrayList<>());
        res.setPreferredRoles(new ArrayList<>());
        res.setCareerInterests(new ArrayList<>());
        res.setTargetCompanies(new ArrayList<>());
        res.setPreferredTechnologies(new ArrayList<>());

        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedAt(user.getCreatedAt());
        res.setCompleted(false);

        return res;
    }

    private String trimToNull(String str) {
        if (str == null || str.isBlank()) {
            return null;
        }
        return str.trim();
    }

    private List<String> cleanList(List<String> list) {
        if (list == null) {
            return new ArrayList<>();
        }
        return list.stream()
                .filter(item -> item != null && !item.isBlank())
                .map(String::trim)
                .distinct()
                .collect(Collectors.toList());
    }
}
