package com.preppal.security;

/**
 * Contract for JWT token operations.
 * Extracting an interface allows the implementation to be mocked
 * in unit tests without requiring JVM deep reflection access.
 */
public interface TokenService {

    /** Generates a signed JWT token for the given email (subject). */
    String generateToken(String email);

    /** Returns true if the token signature is valid and not expired. */
    boolean isTokenValid(String token);

    /** Extracts the email (subject) from a validated token. */
    String extractEmail(String token);
}
