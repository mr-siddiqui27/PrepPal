package com.preppal.exception;

/**
 * Thrown when a requested resource (user, profile, etc.) cannot be found.
 * Maps to HTTP 404 in {@link GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
