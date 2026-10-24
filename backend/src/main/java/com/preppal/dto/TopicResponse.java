package com.preppal.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Response DTO for a Topic.
 * {@code progress}: percentage of completed subtopics (floor); -1 if no subtopics exist.
 */
public class TopicResponse {

    private String id;
    private String title;
    private String description;
    private String notes;
    /**
     * Floor percentage of completed subtopics.
     * -1 when the topic has no subtopics (not-yet-trackable state).
     */
    private int progress;
    private int totalSubtopics;
    private int completedSubtopics;
    private List<ResourceLinkResponse> resources = new ArrayList<>();
    private List<SubtopicResponse> subtopics = new ArrayList<>();
    private int orderIndex;

    public TopicResponse() {}

    /* ── Getters & Setters ── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

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

    public List<SubtopicResponse> getSubtopics() { return subtopics; }
    public void setSubtopics(List<SubtopicResponse> subtopics) { this.subtopics = subtopics; }

    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}
