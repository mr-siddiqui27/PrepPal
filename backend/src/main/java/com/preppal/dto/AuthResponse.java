package com.preppal.dto;

/**
 * Response returned on successful registration or login.
 * The password hash is never included.
 */
public class AuthResponse {

    private final String token;
    private final String id;
    private final String fullName;
    private final String email;
    private final String role;

    public AuthResponse(String token, String id, String fullName, String email, String role) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
