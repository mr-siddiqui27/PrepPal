package com.preppal.service;

import com.preppal.dto.AuthResponse;
import com.preppal.dto.LoginRequest;
import com.preppal.dto.RegisterRequest;
import com.preppal.exception.EmailAlreadyExistsException;
import com.preppal.model.Role;
import com.preppal.model.User;
import com.preppal.repository.UserRepository;
import com.preppal.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService unit tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private AuthenticationManager authenticationManager;

    // Real BCrypt encoder — tests actual password hashing
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository, passwordEncoder, jwtTokenProvider, authenticationManager);
    }

    /* ── Registration ─────────────────────────────────────── */

    @Test
    @DisplayName("register: saves user with BCrypt-hashed password, STUDENT role, returns token")
    void register_success() {
        RegisterRequest req = registerRequest("Jane Doe", "jane@example.com", "Password1!");

        when(userRepository.existsByEmail("jane@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId("user-id-123");
            return u;
        });
        when(jwtTokenProvider.generateToken("jane@example.com")).thenReturn("signed-jwt");

        AuthResponse response = authService.register(req);

        assertThat(response.getToken()).isEqualTo("signed-jwt");
        assertThat(response.getEmail()).isEqualTo("jane@example.com");
        assertThat(response.getFullName()).isEqualTo("Jane Doe");
        assertThat(response.getRole()).isEqualTo("STUDENT");

        // Verify saved user has a hashed password (not plain text)
        verify(userRepository).save(argThat(user -> {
            assertThat(user.getPassword()).isNotEqualTo("Password1!");
            assertThat(passwordEncoder.matches("Password1!", user.getPassword())).isTrue();
            assertThat(user.getRole()).isEqualTo(Role.STUDENT);
            assertThat(user.getEmail()).isEqualTo("jane@example.com");
            return true;
        }));
    }

    @Test
    @DisplayName("register: normalizes email to lower-case")
    void register_normalizesEmail() {
        RegisterRequest req = registerRequest("Bob", "BOB@EXAMPLE.COM", "Secret123!");

        when(userRepository.existsByEmail("bob@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("tok");

        authService.register(req);

        verify(userRepository).existsByEmail("bob@example.com");
        verify(userRepository).save(argThat(u -> "bob@example.com".equals(u.getEmail())));
    }

    @Test
    @DisplayName("register: throws EmailAlreadyExistsException for duplicate email")
    void register_duplicateEmail_throws409() {
        RegisterRequest req = registerRequest("Jane", "jane@example.com", "Password1!");
        when(userRepository.existsByEmail("jane@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(EmailAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("register: password is BCrypt-hashed and cannot be stored as plain text")
    void register_passwordIsHashed() {
        String plainPassword = "MySecret99!";
        RegisterRequest req = registerRequest("Alice", "alice@test.com", plainPassword);

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("tok");

        authService.register(req);

        verify(userRepository).save(argThat(user -> {
            assertThat(user.getPassword()).doesNotContain(plainPassword);
            assertThat(user.getPassword()).startsWith("$2a$");  // BCrypt prefix
            return true;
        }));
    }

    /* ── Login ────────────────────────────────────────────── */

    @Test
    @DisplayName("login: returns token for valid credentials")
    void login_success() {
        User storedUser = user("user-1", "jane@example.com", "hashed", Role.STUDENT);
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(storedUser));
        when(jwtTokenProvider.generateToken("jane@example.com")).thenReturn("jwt-token");

        LoginRequest req = loginRequest("jane@example.com", "Password1!");
        AuthResponse response = authService.login(req);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo("jane@example.com");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("login: throws BadCredentialsException for invalid password")
    void login_invalidPassword_throwsException() {
        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any());

        LoginRequest req = loginRequest("jane@example.com", "WrongPassword");

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }

    /* ── Helpers ──────────────────────────────────────────── */

    private RegisterRequest registerRequest(String name, String email, String password) {
        RegisterRequest r = new RegisterRequest();
        r.setFullName(name);
        r.setEmail(email);
        r.setPassword(password);
        return r;
    }

    private LoginRequest loginRequest(String email, String password) {
        LoginRequest r = new LoginRequest();
        r.setEmail(email);
        r.setPassword(password);
        return r;
    }

    private User user(String id, String email, String password, Role role) {
        User u = new User("Jane Doe", email, password, role, Instant.now());
        u.setId(id);
        return u;
    }
}
