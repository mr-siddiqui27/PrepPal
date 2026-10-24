package com.preppal.exception;

import com.preppal.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Centralised exception handler.
 * <p>
 * All responses use {@link ApiErrorResponse} — no raw exception
 * messages, stack traces, or database details are ever returned to clients.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** Bean validation failures (@Valid on request bodies). */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> fieldErrors.put(fe.getField(), fe.getDefaultMessage()));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        "Validation Failed",
                        "One or more fields are invalid.",
                        request.getRequestURI(),
                        fieldErrors));
    }

    /** Path/query parameter constraint violations. */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex, HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        "Constraint Violation",
                        "Request parameter validation failed.",
                        request.getRequestURI(),
                        null));
    }

    /** 409 – duplicate email registration. */
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailExists(
            EmailAlreadyExistsException ex, HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiErrorResponse(
                        HttpStatus.CONFLICT.value(),
                        "Conflict",
                        ex.getMessage(),
                        request.getRequestURI(),
                        null));
    }

    /** 401 – authentication failure (bad credentials). */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthentication(
            AuthenticationException ex, HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ApiErrorResponse(
                        HttpStatus.UNAUTHORIZED.value(),
                        "Unauthorized",
                        "Invalid email or password.",
                        request.getRequestURI(),
                        null));
    }

    /** 404 – resource not found. */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ApiErrorResponse(
                        HttpStatus.NOT_FOUND.value(),
                        "Not Found",
                        ex.getMessage(),
                        request.getRequestURI(),
                        null));
    }

    /** 404 – unknown routes. */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(
            NoResourceFoundException ex, HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ApiErrorResponse(
                        HttpStatus.NOT_FOUND.value(),
                        "Not Found",
                        "The requested resource was not found.",
                        request.getRequestURI(),
                        null));
    }

    /** Catch-all — prevents leaking internal details. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(
            Exception ex, HttpServletRequest request) {

        log.error("Unhandled exception on [{}] {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage(), ex);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorResponse(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "Internal Server Error",
                        "An unexpected error occurred. Please try again later.",
                        request.getRequestURI(),
                        null));
    }
}
