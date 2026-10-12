package com.preppal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * MongoDB document representing a PrepPal user.
 * <p>
 * The {@code password} field stores a BCrypt hash and must never be
 * included in any API response DTO.
 */
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String fullName;

    /** Stored in lower-case for consistent uniqueness enforcement. */
    @Indexed(unique = true)
    private String email;

    /** BCrypt hash — never returned to clients. */
    private String password;

    private Role role;

    private Instant createdAt;

    /* ── Constructors ─────────────────────────────────────── */

    public User() {}

    public User(String fullName, String email, String password, Role role, Instant createdAt) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    /* ── Getters & Setters ────────────────────────────────── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
