package com.preppal.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

/**
 * Request DTO for creating or updating a Topic within a Goal.
 */
public class TopicRequest {

    private String id; // present when updating an existing topic

    @NotBlank(message = "Topic title is required.")
    @Size(max = 300, message = "Topic title must not exceed 300 characters.")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters.")
    private String description;

    @Size(max = 5000, message = "Notes must not exceed 5000 characters.")
    private String notes;

    @Valid
    private List<ResourceLinkRequest> resources = new ArrayList<>();

    @Valid
    private List<SubtopicRequest> subtopics = new ArrayList<>();

    private int orderIndex;

    /* ── Getters & Setters ── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<ResourceLinkRequest> getResources() { return resources; }
    public void setResources(List<ResourceLinkRequest> resources) {
        this.resources = (resources != null) ? resources : new ArrayList<>();
    }

    public List<SubtopicRequest> getSubtopics() { return subtopics; }
    public void setSubtopics(List<SubtopicRequest> subtopics) {
        this.subtopics = (subtopics != null) ? subtopics : new ArrayList<>();
    }

    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}
