package com.preppal.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

/**
 * Stateless JWT utility: token creation and validation.
 * <p>
 * The signing key is derived from the JWT_SECRET environment variable
 * (Base64-encoded, minimum 256 bits). The application will fail to start
 * if the variable is missing or blank.
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String base64Secret,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs) {

        if (base64Secret == null || base64Secret.isBlank()) {
            throw new IllegalStateException(
                    "JWT_SECRET environment variable is missing or blank. " +
                    "Set a Base64-encoded secret of at least 256 bits.");
        }
        byte[] keyBytes = Base64.getDecoder().decode(base64Secret);
        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                    "JWT_SECRET is too short. Provide a Base64-encoded secret of at least 32 bytes (256 bits).");
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    /** Creates a signed JWT with the user's email as the subject. */
    public String generateToken(String email) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    /** Extracts the email (subject) from a validated token. */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    /** Returns true only if the token signature is valid and it has not expired. */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
