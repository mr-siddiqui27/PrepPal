package com.preppal.dto;

/**
 * Response body returned by GET /api/v1/health.
 */
public class HealthResponse {

    private final String status;
    private final String application;

    public HealthResponse(String status, String application) {
        this.status = status;
        this.application = application;
    }

    public String getStatus() {
        return status;
    }

    public String getApplication() {
        return application;
    }
}
