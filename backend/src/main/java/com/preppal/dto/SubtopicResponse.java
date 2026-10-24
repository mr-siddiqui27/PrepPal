package com.preppal.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Response DTO for a Subtopic.
 * {@code progress}: 0 if incomplete, 100 if complete.
 */
public class SubtopicResponse {

    private String id;
    private String title;
    private String description;
    private boolean completed;
    private int progress; // 0 or 100
    private String difficulty;
    private Integer estimatedMinutes;
    private String notes;
    private List<ResourceLinkResponse> resources = new ArrayList<>();
    private List<SubtopicResponse> subtopics = new ArrayList<>();
    private int orderIndex;

    public SubtopicResponse() {}

    /* ── Getters & Setters ── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<ResourceLinkResponse> getResources() { return resources; }
    public void setResources(List<ResourceLinkResponse> resources) { this.resources = resources; }

    public List<SubtopicResponse> getSubtopics() { return subtopics; }
    public void setSubtopics(List<SubtopicResponse> subtopics) { this.subtopics = subtopics; }

    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}
