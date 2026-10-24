package com.preppal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.preppal.dto.ProfileResponse;
import com.preppal.dto.ProfileUpdateRequest;
import com.preppal.service.ProfileService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProfileController.class)
@Import(com.preppal.config.SecurityConfig.class)
@DisplayName("ProfileController WebMvc Slice Tests")
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfileService profileService;

    // Required by SecurityConfig beans
    @MockBean
    private com.preppal.security.JwtTokenProvider jwtTokenProvider;

    @MockBean
    private com.preppal.security.PrepPalUserDetailsService userDetailsService;

    @org.springframework.boot.test.context.TestConfiguration
    static class TestConfig {
        @org.springframework.context.annotation.Bean
        public com.preppal.security.JwtAuthenticationFilter jwtAuthenticationFilter(
                com.preppal.security.JwtTokenProvider tokenProvider,
                com.preppal.security.PrepPalUserDetailsService userDetailsService) {
            return new com.preppal.security.JwtAuthenticationFilter(tokenProvider, userDetailsService);
        }
    }

    @Test
    @WithMockUser(username = "jane@example.com", roles = "STUDENT")
    @DisplayName("GET /api/v1/profile/me: authenticated user returns 200 with profile")
    void getMyProfile_authenticated_returns200() throws Exception {
        ProfileResponse response = new ProfileResponse();
        response.setUserId("usr-123");
        response.setFullName("Jane Doe");
        response.setEmail("jane@example.com");
        response.setCollegeName("Apex College");
        response.setDegree("B.Tech");
        response.setProgrammingLanguages(List.of("Java", "Kotlin"));
        response.setCareerGoal("Backend Engineer");

        when(profileService.getProfile("jane@example.com")).thenReturn(response);

        mockMvc.perform(get("/api/v1/profile/me")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("usr-123"))
                .andExpect(jsonPath("$.fullName").value("Jane Doe"))
                .andExpect(jsonPath("$.email").value("jane@example.com"))
                .andExpect(jsonPath("$.collegeName").value("Apex College"))
                .andExpect(jsonPath("$.programmingLanguages[0]").value("Java"))
                .andExpect(jsonPath("$.careerGoal").value("Backend Engineer"));
    }

    @Test
    @DisplayName("GET /api/v1/profile/me: unauthenticated request returns 401 or 403")
    void getMyProfile_unauthenticated_returnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/profile/me")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "jane@example.com", roles = "STUDENT")
    @DisplayName("PUT /api/v1/profile/me: authenticated user updates profile and returns 200")
    void updateMyProfile_authenticated_returns200() throws Exception {
        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setCollegeName("Tech University");
        request.setDegree("B.Tech");
        request.setGraduationYear(2026);
        request.setProgrammingLanguages(List.of("Java", "TypeScript"));

        ProfileResponse response = new ProfileResponse();
        response.setUserId("usr-123");
        response.setFullName("Jane Doe");
        response.setEmail("jane@example.com");
        response.setCollegeName("Tech University");
        response.setDegree("B.Tech");
        response.setGraduationYear(2026);
        response.setProgrammingLanguages(List.of("Java", "TypeScript"));

        when(profileService.updateProfile(eq("jane@example.com"), any(ProfileUpdateRequest.class)))
                .thenReturn(response);

        mockMvc.perform(put("/api/v1/profile/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.collegeName").value("Tech University"))
                .andExpect(jsonPath("$.graduationYear").value(2026))
                .andExpect(jsonPath("$.programmingLanguages[0]").value("Java"));
    }

    @Test
    @DisplayName("PUT /api/v1/profile/me: unauthenticated request returns 401 or 403")
    void updateMyProfile_unauthenticated_returnsForbidden() throws Exception {
        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setCollegeName("Tech University");

        mockMvc.perform(put("/api/v1/profile/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "jane@example.com", roles = "STUDENT")
    @DisplayName("PUT /api/v1/profile/me: invalid graduation year returns 400 Bad Request")
    void updateMyProfile_invalidInput_returns400() throws Exception {
        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setGraduationYear(1800); // Invalid year (must be >= 1990)

        mockMvc.perform(put("/api/v1/profile/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors.graduationYear").exists());
    }
}
