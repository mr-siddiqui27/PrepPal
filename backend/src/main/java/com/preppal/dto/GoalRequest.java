package com.preppal.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Request DTO for creating or updating a Goal.
 * UserId is never accepted from the client — always extracted from JWT.
 */
public class GoalRequest {

    @NotBlank(message = "Goal title is required.")
    @Size(max = 300, message = "Goal title must not exceed 300 characters.")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters.")
    private String description;

    @Size(max = 100, message = "Category must not exceed 100 characters.")
    private String category;

    /** LOW, MEDIUM, HIGH — defaults to MEDIUM if omitted. */
    @Size(max = 20, message = "Priority must not exceed 20 characters.")
    private String priority;

    /** NOT_STARTED, IN_PROGRESS, COMPLETED, PAUSED — defaults to NOT_STARTED if omitted. */
    @Size(max = 30, message = "Status must not exceed 30 characters.")
    private String status;

    private LocalDate startDate;
    private LocalDate targetDate;

    @Size(max = 5000, message = "Notes must not exceed 5000 characters.")
    private String notes;

    @Valid
    private List<ResourceLinkRequest> resources = new ArrayList<>();

    @Valid
    private List<TopicRequest> topics = new ArrayList<>();

    /**
     * If both dates are present, startDate must not be after targetDate.
     */
    @AssertTrue(message = "Start date must not be after target date.")
    public boolean isDateRangeValid() {
        if (startDate == null || targetDate == null) {
            return true;
        }
        return !startDate.isAfter(targetDate);
    }

    /* ── Getters & Setters ── */

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

    public List<ResourceLinkRequest> getResources() { return resources; }
    public void setResources(List<ResourceLinkRequest> resources) {
        this.resources = (resources != null) ? resources : new ArrayList<>();
    }

    public List<TopicRequest> getTopics() { return topics; }
    public void setTopics(List<TopicRequest> topics) {
        this.topics = (topics != null) ? topics : new ArrayList<>();
    }
}
