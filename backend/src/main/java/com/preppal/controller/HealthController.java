package com.preppal.controller;

import com.preppal.dto.HealthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Custom application health endpoint.
 * <p>
 * This endpoint does NOT depend on MongoDB or any other infrastructure,
 * so it responds successfully even when the database is not yet configured.
 */
@RestController
@RequestMapping("/api/v1")
public class HealthController {

    private static final String APPLICATION_NAME = "preppal-backend";

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> health() {
        return ResponseEntity.ok(new HealthResponse("UP", APPLICATION_NAME));
    }
}
