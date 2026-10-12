package com.preppal.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

/**
 * Unified error response body for all API error scenarios.
 * <p>
 * Stack traces, internal exception messages, and database details
 * are never included here.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    private final int status;
    private final String error;
    private final String message;
    private final String path;
    private final Instant timestamp;

    /** Optional map of field → validation error, present only for 400 validation errors. */
    private final Map<String, String> fieldErrors;

    public ApiErrorResponse(int status, String error, String message, String path,
                            Map<String, String> fieldErrors) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.timestamp = Instant.now();
        this.fieldErrors = (fieldErrors != null && fieldErrors.isEmpty()) ? null : fieldErrors;
    }

    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
    public String getPath() { return path; }
    public Instant getTimestamp() { return timestamp; }
    public Map<String, String> getFieldErrors() { return fieldErrors; }
}
