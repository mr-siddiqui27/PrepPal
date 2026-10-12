package com.preppal.service;

import com.preppal.dto.AuthResponse;
import com.preppal.dto.LoginRequest;
import com.preppal.dto.RegisterRequest;
import com.preppal.exception.EmailAlreadyExistsException;
import com.preppal.model.Role;
import com.preppal.model.User;
import com.preppal.repository.UserRepository;
import com.preppal.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Handles user registration and login.
 * <p>
 * Passwords are BCrypt-hashed before storage.
 * JWTs are signed and returned on success.
 * No plain-text passwords or hashes are ever included in responses.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registers a new user.
     *
     * @throws EmailAlreadyExistsException if the email is already registered.
     */
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        User user = new User(
                request.getFullName().trim(),
                normalizedEmail,
                passwordEncoder.encode(request.getPassword()),
                Role.STUDENT,           // role always set server-side
                Instant.now()
        );

        User saved = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(saved.getEmail());

        return new AuthResponse(token, saved.getId(), saved.getFullName(),
                saved.getEmail(), saved.getRole().name());
    }

    /**
     * Authenticates a user and returns a JWT.
     *
     * @throws AuthenticationException (→ HTTP 401) for invalid credentials.
     */
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        // Delegates credential verification to Spring Security (BCrypt comparison)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword()));

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new org.springframework.security.authentication
                        .BadCredentialsException("Invalid email or password."));

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return new AuthResponse(token, user.getId(), user.getFullName(),
                user.getEmail(), user.getRole().name());
    }
}
