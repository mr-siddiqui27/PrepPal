package com.preppal.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Request payload for PUT /api/v1/profile/me.
 * Protected fields (password, email, role, id) are excluded to ensure security.
 * All fields are optional to allow saving partially completed profiles.
 */
public class ProfileUpdateRequest {

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    /* Academic Information */
    @Size(max = 150, message = "College name must not exceed 150 characters")
    private String collegeName;

    @Size(max = 100, message = "Degree must not exceed 100 characters")
    private String degree;

    @Size(max = 100, message = "Branch must not exceed 100 characters")
    private String branch;

    @Min(value = 1990, message = "Graduation year must be at least 1990")
    @Max(value = 2050, message = "Graduation year must not exceed 2050")
    private Integer graduationYear;

    /* Technical Skills */
    private List<@Size(max = 50, message = "Skill name must not exceed 50 characters") String> programmingLanguages;
    private List<@Size(max = 50, message = "Skill name must not exceed 50 characters") String> technicalSkills;
    private List<@Size(max = 50, message = "Framework name must not exceed 50 characters") String> frameworks;
    private List<@Size(max = 50, message = "Tool name must not exceed 50 characters") String> toolsAndDatabases;

    /* Career Preferences */
    @Size(max = 200, message = "Career goal must not exceed 200 characters")
    private String careerGoal;

    private List<@Size(max = 50, message = "Role name must not exceed 50 characters") String> preferredRoles;
    private List<@Size(max = 50, message = "Interest name must not exceed 50 characters") String> careerInterests;
    private List<@Size(max = 50, message = "Company name must not exceed 50 characters") String> targetCompanies;
    private List<@Size(max = 50, message = "Technology name must not exceed 50 characters") String> preferredTechnologies;

    /* Profile Media */
    private String profilePictureUrl;

    public ProfileUpdateRequest() {}

    /* ── Getters and Setters ────────────────────────────── */

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

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

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
}
