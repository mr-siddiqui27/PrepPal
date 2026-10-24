package com.preppal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * MongoDB document representing a Student's Profile.
 * Stored separately from the {@link User} authentication record
 * to guarantee security isolation and schema evolution independence.
 */
@Document(collection = "student_profiles")
public class StudentProfile {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    @Indexed(unique = true)
    private String email;

    /* ── Academic Information ───────────────────────────── */
    private String collegeName;
    private String degree;
    private String branch;
    private Integer graduationYear;

    /* ── Technical Skills ───────────────────────────────── */
    private List<String> programmingLanguages = new ArrayList<>();
    private List<String> technicalSkills = new ArrayList<>();
    private List<String> frameworks = new ArrayList<>();
    private List<String> toolsAndDatabases = new ArrayList<>();

    /* ── Career Preferences ─────────────────────────────── */
    private String careerGoal;
    private List<String> preferredRoles = new ArrayList<>();
    private List<String> careerInterests = new ArrayList<>();
    private List<String> targetCompanies = new ArrayList<>();
    private List<String> preferredTechnologies = new ArrayList<>();

    /* ── Profile Media ──────────────────────────────────── */
    private String profilePictureUrl;

    /* ── Metadata ───────────────────────────────────────── */
    private Instant createdAt;
    private Instant updatedAt;

    public StudentProfile() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public StudentProfile(String userId, String email) {
        this();
        this.userId = userId;
        this.email = email;
    }

    /* ── Getters and Setters ────────────────────────────── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

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
        this.programmingLanguages = (programmingLanguages != null) ? programmingLanguages : new ArrayList<>();
    }

    public List<String> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<String> technicalSkills) {
        this.technicalSkills = (technicalSkills != null) ? technicalSkills : new ArrayList<>();
    }

    public List<String> getFrameworks() { return frameworks; }
    public void setFrameworks(List<String> frameworks) {
        this.frameworks = (frameworks != null) ? frameworks : new ArrayList<>();
    }

    public List<String> getToolsAndDatabases() { return toolsAndDatabases; }
    public void setToolsAndDatabases(List<String> toolsAndDatabases) {
        this.toolsAndDatabases = (toolsAndDatabases != null) ? toolsAndDatabases : new ArrayList<>();
    }

    public String getCareerGoal() { return careerGoal; }
    public void setCareerGoal(String careerGoal) { this.careerGoal = careerGoal; }

    public List<String> getPreferredRoles() { return preferredRoles; }
    public void setPreferredRoles(List<String> preferredRoles) {
        this.preferredRoles = (preferredRoles != null) ? preferredRoles : new ArrayList<>();
    }

    public List<String> getCareerInterests() { return careerInterests; }
    public void setCareerInterests(List<String> careerInterests) {
        this.careerInterests = (careerInterests != null) ? careerInterests : new ArrayList<>();
    }

    public List<String> getTargetCompanies() { return targetCompanies; }
    public void setTargetCompanies(List<String> targetCompanies) {
        this.targetCompanies = (targetCompanies != null) ? targetCompanies : new ArrayList<>();
    }

    public List<String> getPreferredTechnologies() { return preferredTechnologies; }
    public void setPreferredTechnologies(List<String> preferredTechnologies) {
        this.preferredTechnologies = (preferredTechnologies != null) ? preferredTechnologies : new ArrayList<>();
    }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
