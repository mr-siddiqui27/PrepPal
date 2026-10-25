package com.preppal.controller;

import com.preppal.dto.ScheduleActivityRequest;
import com.preppal.dto.ScheduleActivityResponse;
import com.preppal.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST controller exposing Schedule endpoints.
 * All endpoints require a valid JWT Bearer token.
 * Ownership is enforced server-side via the authenticated principal.
 *
 * <h3>Routes</h3>
 * <pre>
 * GET    /api/v1/schedule                   — Get activities for a date range (?startDate=&endDate=)
 * GET    /api/v1/schedule/day               — Get activities for a single date (?date=)
 * POST   /api/v1/schedule                   — Create activity (with optional recurrence)
 * PUT    /api/v1/schedule/{id}              — Update activity
 * PATCH  /api/v1/schedule/{id}/status       — Update status only
 * DELETE /api/v1/schedule/{id}              — Delete activity
 * </pre>
 */
@RestController
@RequestMapping("/api/v1/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    /**
     * Get all activities in a date range.
     * Query params: startDate (ISO), endDate (ISO).
     * Default: current week (Mon–Sun).
     */
    @GetMapping
    public ResponseEntity<List<ScheduleActivityResponse>> getActivitiesForRange(
            Authentication auth,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (startDate == null) startDate = LocalDate.now().with(java.time.DayOfWeek.MONDAY);
        if (endDate == null) endDate = startDate.plusDays(6);

        return ResponseEntity.ok(
                scheduleService.getActivitiesForRange(auth.getName(), startDate, endDate));
    }

    /**
     * Get all activities for a single day.
     * Query param: date (ISO). Default: today.
     */
    @GetMapping("/day")
    public ResponseEntity<List<ScheduleActivityResponse>> getActivitiesForDay(
            Authentication auth,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if (date == null) date = LocalDate.now();
        return ResponseEntity.ok(scheduleService.getActivitiesForDate(auth.getName(), date));
    }

    /**
     * Create a new activity.
     * If recurrence is set, creates multiple child instances and returns all of them.
     */
    @PostMapping
    public ResponseEntity<List<ScheduleActivityResponse>> createActivity(
            Authentication auth,
            @Valid @RequestBody ScheduleActivityRequest request) {
        List<ScheduleActivityResponse> created = scheduleService.createActivity(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update all fields of an existing activity.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ScheduleActivityResponse> updateActivity(
            Authentication auth,
            @PathVariable String id,
            @Valid @RequestBody ScheduleActivityRequest request) {
        return ResponseEntity.ok(scheduleService.updateActivity(auth.getName(), id, request));
    }

    /**
     * Update only the status of an activity.
     * Body: { "status": "PLANNED|IN_PROGRESS|COMPLETED|SKIPPED" }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ScheduleActivityResponse> updateStatus(
            Authentication auth,
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "PLANNED");
        return ResponseEntity.ok(scheduleService.updateStatus(auth.getName(), id, status));
    }

    /**
     * Delete an activity by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(
            Authentication auth,
            @PathVariable String id) {
        scheduleService.deleteActivity(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
