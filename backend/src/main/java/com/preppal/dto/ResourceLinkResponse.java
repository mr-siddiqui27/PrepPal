package com.preppal.dto;

/**
 * Response DTO for a ResourceLink — safe for client consumption.
 */
public class ResourceLinkResponse {

    private String id;
    private String title;
    private String url;
    private String type;
    private String description;

    public ResourceLinkResponse() {}

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
