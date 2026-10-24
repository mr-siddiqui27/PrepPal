package com.preppal.service;

import com.preppal.dto.ProfileResponse;
import com.preppal.dto.ProfileUpdateRequest;
import com.preppal.exception.ResourceNotFoundException;
import com.preppal.model.Role;
import com.preppal.model.StudentProfile;
import com.preppal.model.User;
import com.preppal.repository.StudentProfileRepository;
import com.preppal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProfileService Unit Tests")
class ProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository profileRepository;

    private ProfileService profileService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        profileService = new ProfileService(userRepository, profileRepository);

        sampleUser = new User("Jane Doe", "jane@example.com", "hashed_pwd", Role.STUDENT, Instant.now());
        sampleUser.setId("usr-123");
    }

    @Test
    @DisplayName("getProfile: returns existing profile with user account details")
    void getProfile_whenProfileExists_returnsProfileDetails() {
        StudentProfile profile = new StudentProfile("usr-123", "jane@example.com");
        profile.setId("prof-1");
        profile.setCollegeName("Apex Tech");
        profile.setDegree("B.Tech");
        profile.setBranch("CSE");
        profile.setGraduationYear(2027);
        profile.setProgrammingLanguages(List.of("Java", "Python"));
        profile.setCareerGoal("Software Engineer");

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(profileRepository.findByUserId("usr-123")).thenReturn(Optional.of(profile));

        ProfileResponse response = profileService.getProfile("jane@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo("usr-123");
        assertThat(response.getFullName()).isEqualTo("Jane Doe");
        assertThat(response.getEmail()).isEqualTo("jane@example.com");
        assertThat(response.getCollegeName()).isEqualTo("Apex Tech");
        assertThat(response.getDegree()).isEqualTo("B.Tech");
        assertThat(response.getProgrammingLanguages()).containsExactly("Java", "Python");
        assertThat(response.getCareerGoal()).isEqualTo("Software Engineer");
        assertThat(response.isCompleted()).isTrue();
    }

    @Test
    @DisplayName("getProfile: returns initial empty profile when student has not yet created one")
    void getProfile_whenProfileDoesNotExist_returnsInitialProfile() {
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(profileRepository.findByUserId("usr-123")).thenReturn(Optional.empty());

        ProfileResponse response = profileService.getProfile("jane@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isNull();
        assertThat(response.getUserId()).isEqualTo("usr-123");
        assertThat(response.getFullName()).isEqualTo("Jane Doe");
        assertThat(response.getEmail()).isEqualTo("jane@example.com");
        assertThat(response.getCollegeName()).isNull();
        assertThat(response.getProgrammingLanguages()).isEmpty();
        assertThat(response.isCompleted()).isFalse();
    }

    @Test
    @DisplayName("getProfile: throws ResourceNotFoundException if user record does not exist")
    void getProfile_whenUserNotFound_throwsException() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.getProfile("unknown@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("updateProfile: creates new profile if one does not exist and persists it")
    void updateProfile_whenProfileDoesNotExist_createsNewProfile() {
        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setCollegeName("National Tech");
        request.setDegree("B.E.");
        request.setBranch("IT");
        request.setGraduationYear(2026);
        request.setProgrammingLanguages(List.of("JavaScript", "TypeScript"));
        request.setCareerGoal("Full Stack Developer");

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(profileRepository.findByUserId("usr-123")).thenReturn(Optional.empty());
        when(profileRepository.save(any(StudentProfile.class))).thenAnswer(inv -> {
            StudentProfile p = inv.getArgument(0);
            p.setId("prof-generated-1");
            return p;
        });

        ProfileResponse response = profileService.updateProfile("jane@example.com", request);

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo("usr-123");
        assertThat(response.getCollegeName()).isEqualTo("National Tech");
        assertThat(response.getDegree()).isEqualTo("B.E.");
        assertThat(response.getProgrammingLanguages()).containsExactly("JavaScript", "TypeScript");
        assertThat(response.getCareerGoal()).isEqualTo("Full Stack Developer");

        verify(profileRepository).save(argThat(p -> {
            assertThat(p.getUserId()).isEqualTo("usr-123");
            assertThat(p.getEmail()).isEqualTo("jane@example.com");
            return true;
        }));
    }

    @Test
    @DisplayName("updateProfile: updates existing profile and allows updating fullName on user")
    void updateProfile_whenProfileExists_updatesAndPersists() {
        StudentProfile existing = new StudentProfile("usr-123", "jane@example.com");
        existing.setId("prof-1");
        existing.setCollegeName("Old College");

        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setFullName("Jane Smith");
        request.setCollegeName("New University");
        request.setDegree("MCA");
        request.setGraduationYear(2027);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(profileRepository.findByUserId("usr-123")).thenReturn(Optional.of(existing));
        when(profileRepository.save(any(StudentProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        ProfileResponse response = profileService.updateProfile("jane@example.com", request);

        assertThat(response.getFullName()).isEqualTo("Jane Smith");
        assertThat(response.getCollegeName()).isEqualTo("New University");
        assertThat(response.getDegree()).isEqualTo("MCA");

        verify(userRepository).save(argThat(u -> "Jane Smith".equals(u.getFullName())));
        verify(profileRepository).save(argThat(p -> "New University".equals(p.getCollegeName())));
    }
}
