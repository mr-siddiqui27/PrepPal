package com.preppal.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

/**
 * Request DTO for creating or updating a Subtopic.
 */
public class SubtopicRequest {

    private String id; // present when updating an existing subtopic

    @NotBlank(message = "Subtopic title is required.")
    @Size(max = 300, message = "Subtopic title must not exceed 300 characters.")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters.")
    private String description;

    private boolean completed;

    @Size(max = 50, message = "Difficulty must not exceed 50 characters.")
    private String difficulty; // Easy, Medium, Hard

    private Integer estimatedMinutes;

    @Size(max = 5000, message = "Notes must not exceed 5000 characters.")
    private String notes;

    @Valid
    private List<ResourceLinkRequest> resources = new ArrayList<>();

    private int orderIndex;

    /* ── Getters & Setters ── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<ResourceLinkRequest> getResources() { return resources; }
    public void setResources(List<ResourceLinkRequest> resources) {
        this.resources = (resources != null) ? resources : new ArrayList<>();
    }

    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}
