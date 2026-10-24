package com.preppal.dto;

import java.time.Instant;
import java.util.List;

/**
 * DTO returned by GET /api/v1/profile/me and PUT /api/v1/profile/me.
 * Combines account info (fullName, email) with domain profile fields.
 */
public class ProfileResponse {

    private String id;
    private String userId;
    private String fullName;
    private String email;

    /* Academic */
    private String collegeName;
    private String degree;
    private String branch;
    private Integer graduationYear;

    /* Technical Skills */
    private List<String> programmingLanguages;
    private List<String> technicalSkills;
    private List<String> frameworks;
    private List<String> toolsAndDatabases;

    /* Career Preferences */
    private String careerGoal;
    private List<String> preferredRoles;
    private List<String> careerInterests;
    private List<String> targetCompanies;
    private List<String> preferredTechnologies;

    /* Profile Media */
    private String profilePictureUrl;

    /* Metadata */
    private Instant createdAt;
    private Instant updatedAt;
    private boolean isCompleted;

    public ProfileResponse() {}

    /* ── Getters and Setters ────────────────────────────── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public List<String> getProgrammingLanguages() { return programmingLanguages; }
    public void setProgrammingLanguages(List<String> programmingLanguages) {
        this.programmingLanguages = programmingLanguages;
    }

    public List<String> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<String> technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

    public List<String> getFrameworks() { return frameworks; }
    public void setFrameworks(List<String> frameworks) {
        this.frameworks = frameworks;
    }

    public List<String> getToolsAndDatabases() { return toolsAndDatabases; }
    public void setToolsAndDatabases(List<String> toolsAndDatabases) {
        this.toolsAndDatabases = toolsAndDatabases;
    }

    public String getCareerGoal() { return careerGoal; }
    public void setCareerGoal(String careerGoal) { this.careerGoal = careerGoal; }

    public List<String> getPreferredRoles() { return preferredRoles; }
    public void setPreferredRoles(List<String> preferredRoles) {
        this.preferredRoles = preferredRoles;
    }

    public List<String> getCareerInterests() { return careerInterests; }
    public void setCareerInterests(List<String> careerInterests) {
        this.careerInterests = careerInterests;
    }

    public List<String> getTargetCompanies() { return targetCompanies; }
    public void setTargetCompanies(List<String> targetCompanies) {
        this.targetCompanies = targetCompanies;
    }

    public List<String> getPreferredTechnologies() { return preferredTechnologies; }
    public void setPreferredTechnologies(List<String> preferredTechnologies) {
        this.preferredTechnologies = preferredTechnologies;
    }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
}
