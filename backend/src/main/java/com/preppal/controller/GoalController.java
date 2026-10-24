package com.preppal.controller;

import com.preppal.dto.*;
import com.preppal.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller exposing Goal Management endpoints.
 * All endpoints require a valid JWT Bearer token.
 * Ownership is enforced server-side via the authenticated principal.
 *
 * <h3>Routes</h3>
 * <pre>
 * POST   /api/v1/goals                                            — Create a goal
 * GET    /api/v1/goals                                            — List student's goals
 * GET    /api/v1/goals/{goalId}                                   — Get goal by ID
 * PUT    /api/v1/goals/{goalId}                                   — Update a goal
 * PATCH  /api/v1/goals/{goalId}/status                            — Update goal status (ACTIVE, PAUSED, COMPLETED)
 * PATCH  /api/v1/goals/{goalId}/notes                             — Update goal notes
 * DELETE /api/v1/goals/{goalId}                                   — Delete a goal
 *
 * POST   /api/v1/goals/{goalId}/topics                            — Add topic
 * PUT    /api/v1/goals/{goalId}/topics/{topicId}                  — Update topic
 * PATCH  /api/v1/goals/{goalId}/topics/{topicId}/notes            — Update topic notes
 * DELETE /api/v1/goals/{goalId}/topics/{topicId}                  — Delete topic
 *
 * POST   /api/v1/goals/{goalId}/topics/{topicId}/subtopics                    — Add subtopic
 * PUT    /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}       — Update subtopic
 * PATCH  /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}/toggle — Toggle completion
 * PATCH  /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}/notes  — Update subtopic notes
 * DELETE /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}       — Delete subtopic
 *
 * Resources at all 3 levels:
 * POST/PUT/DELETE /api/v1/goals/{goalId}/resources[/{resourceId}]
 * POST/PUT/DELETE /api/v1/goals/{goalId}/topics/{topicId}/resources[/{resourceId}]
 * POST/PUT/DELETE /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}/resources[/{resourceId}]
 * </pre>
 */
@RestController
@RequestMapping("/api/v1/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    /* ── Goal CRUD ─────────────────────────────────────────── */

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(
            Authentication auth,
            @Valid @RequestBody GoalRequest request) {
        GoalResponse response = goalService.createGoal(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> listGoals(Authentication auth) {
        return ResponseEntity.ok(goalService.getGoals(auth.getName()));
    }

    @GetMapping("/{goalId}")
    public ResponseEntity<GoalResponse> getGoal(
            Authentication auth,
            @PathVariable String goalId) {
        return ResponseEntity.ok(goalService.getGoal(auth.getName(), goalId));
    }

    @PutMapping("/{goalId}")
    public ResponseEntity<GoalResponse> updateGoal(
            Authentication auth,
            @PathVariable String goalId,
            @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.updateGoal(auth.getName(), goalId, request));
    }

    @PatchMapping("/{goalId}/status")
    public ResponseEntity<GoalResponse> updateGoalStatus(
            Authentication auth,
            @PathVariable String goalId,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "ACTIVE");
        return ResponseEntity.ok(goalService.updateGoalStatus(auth.getName(), goalId, status));
    }

    @PatchMapping("/{goalId}/notes")
    public ResponseEntity<GoalResponse> updateGoalNotes(
            Authentication auth,
            @PathVariable String goalId,
            @RequestBody Map<String, String> body) {
        String notes = body.get("notes");
        return ResponseEntity.ok(goalService.updateGoalNotes(auth.getName(), goalId, notes));
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(
            Authentication auth,
            @PathVariable String goalId) {
        goalService.deleteGoal(auth.getName(), goalId);
        return ResponseEntity.noContent().build();
    }

    /* ── Topic CRUD ─────────────────────────────────────────── */

    @PostMapping("/{goalId}/topics")
    public ResponseEntity<GoalResponse> addTopic(
            Authentication auth,
            @PathVariable String goalId,
            @Valid @RequestBody TopicRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(goalService.addTopic(auth.getName(), goalId, request));
    }

    @PutMapping("/{goalId}/topics/{topicId}")
    public ResponseEntity<GoalResponse> updateTopic(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @Valid @RequestBody TopicRequest request) {
        return ResponseEntity.ok(goalService.updateTopic(auth.getName(), goalId, topicId, request));
    }

    @PatchMapping("/{goalId}/topics/{topicId}/notes")
    public ResponseEntity<GoalResponse> updateTopicNotes(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @RequestBody Map<String, String> body) {
        String notes = body.get("notes");
        return ResponseEntity.ok(goalService.updateTopicNotes(auth.getName(), goalId, topicId, notes));
    }

    @DeleteMapping("/{goalId}/topics/{topicId}")
    public ResponseEntity<GoalResponse> deleteTopic(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId) {
        return ResponseEntity.ok(goalService.deleteTopic(auth.getName(), goalId, topicId));
    }

    /* ── Subtopic CRUD ──────────────────────────────────────── */

    @PostMapping("/{goalId}/topics/{topicId}/subtopics")
    public ResponseEntity<GoalResponse> addSubtopic(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @Valid @RequestBody SubtopicRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(goalService.addSubtopic(auth.getName(), goalId, topicId, request));
    }

    @PostMapping("/{goalId}/topics/{topicId}/subtopics/{subtopicId}/subtopics")
    public ResponseEntity<GoalResponse> addSubSubtopic(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String subtopicId,
            @Valid @RequestBody SubtopicRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(goalService.addSubSubtopic(auth.getName(), goalId, topicId, subtopicId, request));
    }

    @PutMapping("/{goalId}/topics/{topicId}/subtopics/{subtopicId}")
    public ResponseEntity<GoalResponse> updateSubtopic(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String subtopicId,
            @Valid @RequestBody SubtopicRequest request) {
        return ResponseEntity.ok(
                goalService.updateSubtopic(auth.getName(), goalId, topicId, subtopicId, request));
    }

    @PatchMapping("/{goalId}/topics/{topicId}/subtopics/{subtopicId}/toggle")
    public ResponseEntity<GoalResponse> toggleSubtopic(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String subtopicId,
            @RequestBody Map<String, Boolean> body) {
        boolean completed = Boolean.TRUE.equals(body.get("completed"));
        return ResponseEntity.ok(
                goalService.toggleSubtopic(auth.getName(), goalId, topicId, subtopicId, completed));
    }

    @PatchMapping("/{goalId}/topics/{topicId}/subtopics/{subtopicId}/notes")
    public ResponseEntity<GoalResponse> updateSubtopicNotes(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String subtopicId,
            @RequestBody Map<String, String> body) {
        String notes = body.get("notes");
        return ResponseEntity.ok(
                goalService.updateSubtopicNotes(auth.getName(), goalId, topicId, subtopicId, notes));
    }

    @DeleteMapping("/{goalId}/topics/{topicId}/subtopics/{subtopicId}")
    public ResponseEntity<GoalResponse> deleteSubtopic(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String subtopicId) {
        return ResponseEntity.ok(
                goalService.deleteSubtopic(auth.getName(), goalId, topicId, subtopicId));
    }

    /* ── Resources at 3 Levels ───────────────────────────────── */

    // 1. Goal-level resources
    @PostMapping("/{goalId}/resources")
    public ResponseEntity<GoalResponse> addGoalResource(
            Authentication auth,
            @PathVariable String goalId,
            @Valid @RequestBody ResourceLinkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(goalService.addGoalResource(auth.getName(), goalId, request));
    }

    @PutMapping("/{goalId}/resources/{resourceId}")
    public ResponseEntity<GoalResponse> updateGoalResource(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String resourceId,
            @Valid @RequestBody ResourceLinkRequest request) {
        return ResponseEntity.ok(
                goalService.updateGoalResource(auth.getName(), goalId, resourceId, request));
    }

    @DeleteMapping("/{goalId}/resources/{resourceId}")
    public ResponseEntity<GoalResponse> deleteGoalResource(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String resourceId) {
        return ResponseEntity.ok(
                goalService.deleteGoalResource(auth.getName(), goalId, resourceId));
    }

    // 2. Topic-level resources
    @PostMapping("/{goalId}/topics/{topicId}/resources")
    public ResponseEntity<GoalResponse> addTopicResource(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @Valid @RequestBody ResourceLinkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(goalService.addTopicResource(auth.getName(), goalId, topicId, request));
    }

    @PutMapping("/{goalId}/topics/{topicId}/resources/{resourceId}")
    public ResponseEntity<GoalResponse> updateTopicResource(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String resourceId,
            @Valid @RequestBody ResourceLinkRequest request) {
        return ResponseEntity.ok(
                goalService.updateTopicResource(auth.getName(), goalId, topicId, resourceId, request));
    }

    @DeleteMapping("/{goalId}/topics/{topicId}/resources/{resourceId}")
    public ResponseEntity<GoalResponse> deleteTopicResource(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String resourceId) {
        return ResponseEntity.ok(
                goalService.deleteTopicResource(auth.getName(), goalId, topicId, resourceId));
    }

    // 3. Subtopic-level resources
    @PostMapping("/{goalId}/topics/{topicId}/subtopics/{subtopicId}/resources")
    public ResponseEntity<GoalResponse> addSubtopicResource(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String subtopicId,
            @Valid @RequestBody ResourceLinkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(goalService.addSubtopicResource(auth.getName(), goalId, topicId, subtopicId, request));
    }

    @PutMapping("/{goalId}/topics/{topicId}/subtopics/{subtopicId}/resources/{resourceId}")
    public ResponseEntity<GoalResponse> updateSubtopicResource(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String subtopicId,
            @PathVariable String resourceId,
            @Valid @RequestBody ResourceLinkRequest request) {
        return ResponseEntity.ok(
                goalService.updateSubtopicResource(auth.getName(), goalId, topicId, subtopicId, resourceId, request));
    }

    @DeleteMapping("/{goalId}/topics/{topicId}/subtopics/{subtopicId}/resources/{resourceId}")
    public ResponseEntity<GoalResponse> deleteSubtopicResource(
            Authentication auth,
            @PathVariable String goalId,
            @PathVariable String topicId,
            @PathVariable String subtopicId,
            @PathVariable String resourceId) {
        return ResponseEntity.ok(
                goalService.deleteSubtopicResource(auth.getName(), goalId, topicId, subtopicId, resourceId));
    }
}
