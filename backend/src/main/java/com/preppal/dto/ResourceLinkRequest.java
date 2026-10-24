package com.preppal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating or updating a ResourceLink.
 * Used embedded in Goal, Topic, and Subtopic request bodies.
 */
public class ResourceLinkRequest {

    private String id; // present when editing an existing link

    @NotBlank(message = "Resource title is required.")
    @Size(max = 200, message = "Resource title must not exceed 200 characters.")
    private String title;

    @NotBlank(message = "URL is required.")
    @Size(max = 2000, message = "URL must not exceed 2000 characters.")
    @Pattern(
        regexp = "^https?://.*",
        message = "URL must start with http:// or https://"
    )
    private String url;

    @Size(max = 50, message = "Resource type must not exceed 50 characters.")
    private String type; // Video, Article, Course, Documentation, Practice

    @Size(max = 500, message = "Description must not exceed 500 characters.")
    private String description;

    /* ── Getters & Setters ── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
