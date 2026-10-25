package com.preppal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Request DTO for creating or updating a scheduled activity.
 * userId is never accepted from the client — always resolved server-side.
 */
public class ScheduleActivityRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Scheduled date is required")
    private LocalDate scheduledDate;

    private LocalTime startTime;
    private LocalTime endTime;
    private Integer durationMinutes;

    /** PERSONAL or PREPPAL */
    private String activityType = "PERSONAL";

    /** PLANNED, IN_PROGRESS, COMPLETED, SKIPPED */
    private String status = "PLANNED";

    private String category;

    /** LOW, MEDIUM, HIGH */
    private String priority = "MEDIUM";

    // PrepPal link fields (only meaningful when activityType == PREPPAL)
    private String linkedGoalId;
    private String linkedGoalTitle;
    private String linkedTopicId;
    private String linkedTopicTitle;
    private String navigationPath;

    /** NONE, DAILY, WEEKLY */
    private String recurrence = "NONE";

    private LocalDate recurrenceEndDate;

    /* ── Getters & Setters ── */

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
}
