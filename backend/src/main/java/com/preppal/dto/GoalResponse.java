package com.preppal.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Response DTO for a Goal.
 *
 * <h3>Progress semantics</h3>
 * <ul>
 *   <li>{@code progress}: floor percentage of all completed subtopics
 *       across all topics. Returns -1 when no subtopics exist anywhere
 *       in the goal (not-yet-trackable state).</li>
 *   <li>{@code status}: student-managed lifecycle state — independent of
 *       progress. COMPLETED status does not automatically set progress = 100,
 *       and progress = 100 does not automatically set status = COMPLETED.</li>
 * </ul>
 */
public class GoalResponse {

    private String id;
    private String userId;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private LocalDate startDate;
    private LocalDate targetDate;
    private String notes;

    /**
     * Auto-calculated: floor percentage of total completed subtopics / total subtopics.
     * Value is -1 when the goal has no subtopics at all.
     */
    private int progress;
    private int totalSubtopics;
    private int completedSubtopics;

    private List<ResourceLinkResponse> resources = new ArrayList<>();
    private List<TopicResponse> topics = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;

    public GoalResponse() {}

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

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public int getTotalSubtopics() { return totalSubtopics; }
    public void setTotalSubtopics(int totalSubtopics) { this.totalSubtopics = totalSubtopics; }

    public int getCompletedSubtopics() { return completedSubtopics; }
    public void setCompletedSubtopics(int completedSubtopics) { this.completedSubtopics = completedSubtopics; }

    public List<ResourceLinkResponse> getResources() { return resources; }
    public void setResources(List<ResourceLinkResponse> resources) { this.resources = resources; }

    public List<TopicResponse> getTopics() { return topics; }
    public void setTopics(List<TopicResponse> topics) { this.topics = topics; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
