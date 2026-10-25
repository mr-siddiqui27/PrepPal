package com.preppal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * MongoDB document representing a single scheduled activity for a student.
 * <p>
 * Activities can be either:
 * <ul>
 *   <li>PREPPAL — linked to an existing Goal/Topic in PrepPal</li>
 *   <li>PERSONAL — a free-form activity unrelated to any PrepPal feature</li>
 * </ul>
 * <p>
 * Ownership: {@code userId} is always set server-side from the JWT principal.
 * Status lifecycle: PLANNED → IN_PROGRESS → COMPLETED | SKIPPED
 */
@Document(collection = "schedule_activities")
public class ScheduleActivity {

    @Id
    private String id;

    /** Always set server-side from the authenticated JWT principal. */
    @Indexed
    private String userId;

    /* ── Core Fields ─────────────────────────────────────────── */

    /** Display title for the activity. */
    private String title;

    /** Optional description or notes. */
    private String description;

    /** The date this activity is scheduled for. */
    private LocalDate scheduledDate;

    /** Optional start time (HH:mm). */
    private LocalTime startTime;

    /** Optional end time (HH:mm). */
    private LocalTime endTime;

    /** Duration in minutes (optional, used when exact times not set). */
    private Integer durationMinutes;

    /**
     * Type: PREPPAL or PERSONAL.
     * PREPPAL activities link to a goal/topic in the PrepPal system.
     * PERSONAL activities are free-form.
     */
    private String activityType = "PERSONAL";

    /**
     * Status: PLANNED, IN_PROGRESS, COMPLETED, SKIPPED.
     * Default is PLANNED.
     */
    private String status = "PLANNED";

    /**
     * Category / color tag for visual grouping.
     * e.g. DSA, Backend, Interview, Study, Break, Personal
     */
    private String category;

    /** Priority: LOW, MEDIUM, HIGH */
    private String priority = "MEDIUM";

    /* ── PrepPal Link Fields (only for PREPPAL type) ─────────── */

    /** ID of the linked Goal (if activityType == PREPPAL). */
    private String linkedGoalId;

    /** Title of the linked Goal (denormalised for display). */
    private String linkedGoalTitle;

    /** ID of the linked Topic within the goal (optional). */
    private String linkedTopicId;

    /** Title of the linked Topic (denormalised for display). */
    private String linkedTopicTitle;

    /** Frontend navigation path for direct navigation when activity is clicked. */
    private String navigationPath;

    /* ── Recurrence ─────────────────────────────────────────── */

    /**
     * Recurrence pattern: NONE, DAILY, WEEKLY.
     * NONE = one-off, DAILY = every day, WEEKLY = same day every week.
     */
    private String recurrence = "NONE";

    /** For recurring activities, the last date to generate occurrences (inclusive). */
    private LocalDate recurrenceEndDate;

    /** ID of the parent activity if this is a recurring child instance. */
    private String parentActivityId;

    /* ── Metadata ───────────────────────────────────────────── */

    private Instant createdAt;
    private Instant updatedAt;

    public ScheduleActivity() {
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
