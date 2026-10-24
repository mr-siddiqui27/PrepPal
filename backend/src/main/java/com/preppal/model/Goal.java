package com.preppal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * MongoDB document representing a student's learning/career Goal.
 * <p>
 * Topics and Subtopics are embedded to keep ownership simple and
 * avoid expensive cross-document joins. Progress is always derived
 * from subtopic completion — never stored as a plain editable number.
 * <p>
 * Ownership: {@code userId} is always set server-side from the JWT principal.
 * Clients must never supply a userId in request bodies.
 *
 * <h3>Progress Calculation Rules</h3>
 * <ul>
 *   <li>Subtopic: incomplete = 0%, complete = 100%.</li>
 *   <li>Topic: if it has subtopics, completedSubtopics / totalSubtopics * 100 (floor).
 *       If no subtopics, returns -1 (not-yet-trackable).</li>
 *   <li>Goal: if any subtopic exists across all topics,
 *       totalCompleted / totalSubtopics * 100 (floor).
 *       If no subtopics at all, returns -1 (not-yet-trackable).</li>
 * </ul>
 */
@Document(collection = "goals")
public class Goal {

    @Id
    private String id;

    /** Always set server-side from the authenticated JWT principal. */
    @Indexed
    private String userId;

    /* ── Core Fields ─────────────────────────────────────────── */

    private String title;
    private String description;

    /**
     * Category: DSA, Backend Development, Placement Preparation,
     * Interview Preparation, System Design, Other, etc.
     * Open string so students can customise.
     */
    private String category;

    /** Priority: LOW, MEDIUM, HIGH */
    private String priority = "MEDIUM";

    /**
     * Status: NOT_STARTED, IN_PROGRESS, COMPLETED, PAUSED.
     * Managed separately from auto-calculated progress.
     */
    private String status = "NOT_STARTED";

    private LocalDate startDate;
    private LocalDate targetDate;

    private String notes;

    private List<ResourceLink> resources = new ArrayList<>();
    private List<Topic> topics = new ArrayList<>();

    /* ── Metadata ───────────────────────────────────────────── */

    private Instant createdAt;
    private Instant updatedAt;

    public Goal() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    /* ── Getters & Setters ── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<ResourceLink> getResources() {
        if (this.resources == null) {
            this.resources = new ArrayList<>();
        }
        return this.resources;
    }
    public void setResources(List<ResourceLink> resources) {
        this.resources = (resources != null) ? resources : new ArrayList<>();
    }

    public List<Topic> getTopics() {
        if (this.topics == null) {
            this.topics = new ArrayList<>();
        }
        return this.topics;
    }
    public void setTopics(List<Topic> topics) {
        this.topics = (topics != null) ? topics : new ArrayList<>();
    }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
