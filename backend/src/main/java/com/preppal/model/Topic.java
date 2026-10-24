package com.preppal.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Embedded document representing a Topic within a Goal.
 * Progress is calculated from its Subtopics.
 */
public class Topic {

    private String id;
    private String title;
    private String description;
    private String notes;
    private List<ResourceLink> resources = new ArrayList<>();
    private List<Subtopic> subtopics = new ArrayList<>();
    private int orderIndex;

    public Topic() {}

    /* ── Getters & Setters ── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

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
