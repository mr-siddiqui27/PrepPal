package com.preppal.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Embedded document representing a Subtopic within a Topic within a Goal.
 * Completion state here is the source of truth for progress calculation.
 */
public class Subtopic {

    private String id;
    private String title;
    private String description;
    private boolean completed;
    private String difficulty;        // Easy, Medium, Hard (optional)
    private Integer estimatedMinutes; // optional
    private String notes;
    private List<ResourceLink> resources = new ArrayList<>();
    private List<Subtopic> subtopics = new ArrayList<>();
    private int orderIndex;

    public Subtopic() {}

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

    public List<ResourceLink> getResources() {
        if (this.resources == null) {
            this.resources = new ArrayList<>();
        }
        return this.resources;
    }
    public void setResources(List<ResourceLink> resources) {
        this.resources = (resources != null) ? resources : new ArrayList<>();
    }

    public List<Subtopic> getSubtopics() {
        if (this.subtopics == null) {
            this.subtopics = new ArrayList<>();
        }
        return this.subtopics;
    }
    public void setSubtopics(List<Subtopic> subtopics) {
        this.subtopics = (subtopics != null) ? subtopics : new ArrayList<>();
    }

    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}
