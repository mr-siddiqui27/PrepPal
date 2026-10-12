package com.preppal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.preppal.dto.AuthResponse;
import com.preppal.dto.LoginRequest;
import com.preppal.dto.RegisterRequest;
import com.preppal.exception.EmailAlreadyExistsException;
import com.preppal.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Slice test for AuthController.
 * Uses @WebMvcTest so only web layer is loaded — no MongoDB, no real AuthService.
 * Security is imported so permit rules are exercised.
 */
@WebMvcTest(AuthController.class)
@Import(com.preppal.config.SecurityConfig.class)
@DisplayName("AuthController integration tests")
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private AuthService authService;

    // Required by SecurityConfig beans
    @MockBean private com.preppal.security.JwtTokenProvider jwtTokenProvider;
    @MockBean private com.preppal.security.PrepPalUserDetailsService userDetailsService;

    @org.springframework.boot.test.context.TestConfiguration
    static class TestConfig {
        @org.springframework.context.annotation.Bean
        public com.preppal.security.JwtAuthenticationFilter jwtAuthenticationFilter(
                com.preppal.security.JwtTokenProvider tokenProvider,
                com.preppal.security.PrepPalUserDetailsService userDetailsService) {
            return new com.preppal.security.JwtAuthenticationFilter(tokenProvider, userDetailsService);
        }
    }

    /* ── Register ──────────────────────────────────────────── */

    @Test
    @DisplayName("POST /api/v1/auth/register returns 201 with token and user details")
    void register_success_returns201() throws Exception {
        AuthResponse fakeResponse = new AuthResponse(
                "jwt-token", "uid-1", "Jane Doe", "jane@example.com", "STUDENT");
        when(authService.register(any(RegisterRequest.class))).thenReturn(fakeResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Jane Doe",
                                  "email": "jane@example.com",
                                  "password": "Password1!"
                                }"""))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.email").value("jane@example.com"))
                .andExpect(jsonPath("$.role").value("STUDENT"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/v1/auth/register returns 400 when required fields are missing")
    void register_missingFields_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors").exists());
    }

    @Test
    @DisplayName("POST /api/v1/auth/register returns 400 for invalid email format")
    void register_invalidEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Jane",
                                  "email": "not-an-email",
                                  "password": "Password1!"
                                }"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    @DisplayName("POST /api/v1/auth/register returns 409 for duplicate email")
    void register_duplicateEmail_returns409() throws Exception {
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new EmailAlreadyExistsException("jane@example.com"));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Jane Doe",
                                  "email": "jane@example.com",
                                  "password": "Password1!"
                                }"""))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"));
    }

    /* ── Login ─────────────────────────────────────────────── */

    @Test
    @DisplayName("POST /api/v1/auth/login returns 200 with token for valid credentials")
    void login_success_returns200() throws Exception {
        AuthResponse fakeResponse = new AuthResponse(
                "valid-jwt", "uid-1", "Jane Doe", "jane@example.com", "STUDENT");
        when(authService.login(any(LoginRequest.class))).thenReturn(fakeResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "jane@example.com",
                                  "password": "Password1!"
                                }"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("valid-jwt"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/v1/auth/login returns 401 for invalid credentials")
    void login_invalidCredentials_returns401() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "jane@example.com",
                                  "password": "WrongPassword"
                                }"""))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login returns 400 when body is missing required fields")
    void login_missingFields_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
