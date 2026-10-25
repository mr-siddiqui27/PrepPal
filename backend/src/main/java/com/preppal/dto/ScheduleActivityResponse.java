package com.preppal.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Response DTO for a scheduled activity.
 */
public class ScheduleActivityResponse {

    private String id;
    private String userId;
    private String title;
    private String description;
    private LocalDate scheduledDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer durationMinutes;
    private String activityType;
    private String status;
    private String category;
    private String priority;

    // PrepPal link fields
    private String linkedGoalId;
    private String linkedGoalTitle;
    private String linkedTopicId;
    private String linkedTopicTitle;
    private String navigationPath;

    // Recurrence
    private String recurrence;
    private LocalDate recurrenceEndDate;
    private String parentActivityId;

    private Instant createdAt;
    private Instant updatedAt;

    /* ── Getters & Setters ── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getLinkedGoalId() { return linkedGoalId; }
    public void setLinkedGoalId(String linkedGoalId) { this.linkedGoalId = linkedGoalId; }

    public String getLinkedGoalTitle() { return linkedGoalTitle; }
    public void setLinkedGoalTitle(String linkedGoalTitle) { this.linkedGoalTitle = linkedGoalTitle; }

    public String getLinkedTopicId() { return linkedTopicId; }
    public void setLinkedTopicId(String linkedTopicId) { this.linkedTopicId = linkedTopicId; }

    public String getLinkedTopicTitle() { return linkedTopicTitle; }
    public void setLinkedTopicTitle(String linkedTopicTitle) { this.linkedTopicTitle = linkedTopicTitle; }

    public String getNavigationPath() { return navigationPath; }
    public void setNavigationPath(String navigationPath) { this.navigationPath = navigationPath; }

    public String getRecurrence() { return recurrence; }
    public void setRecurrence(String recurrence) { this.recurrence = recurrence; }

    public LocalDate getRecurrenceEndDate() { return recurrenceEndDate; }
    public void setRecurrenceEndDate(LocalDate recurrenceEndDate) { this.recurrenceEndDate = recurrenceEndDate; }

    public String getParentActivityId() { return parentActivityId; }
    public void setParentActivityId(String parentActivityId) { this.parentActivityId = parentActivityId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
