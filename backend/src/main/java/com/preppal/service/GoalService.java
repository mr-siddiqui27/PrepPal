package com.preppal.service;

import com.preppal.dto.*;
import com.preppal.exception.ResourceNotFoundException;
import com.preppal.model.*;
import com.preppal.repository.GoalRepository;
import com.preppal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for Goal Management operations.
 *
 * <h3>Ownership enforcement</h3>
 * Every mutating operation resolves the authenticated user from their email
 * (extracted from the JWT principal), then uses {@code userId} for all
 * MongoDB queries. Clients cannot supply or spoof a userId.
 *
 * <h3>Progress Calculation (derived — never stored)</h3>
 * <ul>
 *   <li>Subtopic: 0 = incomplete, 100 = complete.</li>
 *   <li>Topic: floor(completedSubtopics / totalSubtopics * 100). Returns -1 if no subtopics.</li>
 *   <li>Goal: floor(allCompletedSubtopics / allSubtopics * 100). Returns -1 if no subtopics at all.</li>
 * </ul>
 * Progress is calculated at response-build time only — never persisted.
 */
@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    /* ══════════════════════════════════════════════════════════
       GOAL CRUD
       ══════════════════════════════════════════════════════════ */

    /** List all goals belonging to the authenticated user. */
    public List<GoalResponse> getGoals(String email) {
        String userId = resolveUserId(email);
        return goalRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /** Get a single goal by ID, ensuring ownership. */
    public GoalResponse getGoal(String email, String goalId) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        return toResponse(goal);
    }

    /** Create a new goal for the authenticated user. */
    public GoalResponse createGoal(String email, GoalRequest request) {
        String userId = resolveUserId(email);
        Goal goal = new Goal();
        goal.setUserId(userId);
        applyGoalRequest(goal, request);
        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    /** Update an existing goal. */
    public GoalResponse updateGoal(String email, String goalId, GoalRequest request) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        applyGoalRequest(goal, request);
        goal.setUpdatedAt(Instant.now());
        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    /** Update only goal status (e.g. ACTIVE, PAUSED, COMPLETED). */
    public GoalResponse updateGoalStatus(String email, String goalId, String status) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        goal.setStatus(normalizeStatus(status));
        goal.setUpdatedAt(Instant.now());
        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    /** Update goal notes. */
    public GoalResponse updateGoalNotes(String email, String goalId, String notes) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        goal.setNotes(trimToNull(notes));
        goal.setUpdatedAt(Instant.now());
        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    /** Delete a goal by ID, ensuring ownership. */
    public void deleteGoal(String email, String goalId) {
        String userId = resolveUserId(email);
        findGoalOwnedBy(goalId, userId);
        goalRepository.deleteByIdAndUserId(goalId, userId);
    }

    /* ══════════════════════════════════════════════════════════
       TOPIC OPERATIONS (nested in Goal)
       ══════════════════════════════════════════════════════════ */

    /** Add a new topic to a goal. */
    public GoalResponse addTopic(String email, String goalId, TopicRequest request) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = buildTopic(request);
        goal.getTopics().add(topic);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Update an existing topic within a goal. */
    public GoalResponse updateTopic(String email, String goalId, String topicId, TopicRequest request) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        applyTopicRequest(topic, request);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Update topic notes. */
    public GoalResponse updateTopicNotes(String email, String goalId, String topicId, String notes) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        topic.setNotes(trimToNull(notes));
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Delete a topic from a goal. */
    public GoalResponse deleteTopic(String email, String goalId, String topicId) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        boolean removed = goal.getTopics().removeIf(t -> topicId.equals(t.getId()));
        if (!removed) {
            throw new ResourceNotFoundException("Topic not found: " + topicId);
        }
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /* ══════════════════════════════════════════════════════════
       SUBTOPIC OPERATIONS (nested in Topic)
       ══════════════════════════════════════════════════════════ */

    /** Add a new subtopic to a topic. */
    public GoalResponse addSubtopic(String email, String goalId, String topicId, SubtopicRequest request) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        Subtopic subtopic = buildSubtopic(request);
        topic.getSubtopics().add(subtopic);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Update an existing subtopic within a topic. */
    public GoalResponse updateSubtopic(String email, String goalId, String topicId,
                                       String subtopicId, SubtopicRequest request) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        Subtopic subtopic = findSubtopicById(topic, subtopicId);
        applySubtopicRequest(subtopic, request);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Update subtopic notes. */
    public GoalResponse updateSubtopicNotes(String email, String goalId, String topicId,
                                            String subtopicId, String notes) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        Subtopic subtopic = findSubtopicById(topic, subtopicId);
        subtopic.setNotes(trimToNull(notes));
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Toggle subtopic completion status. */
    public GoalResponse toggleSubtopic(String email, String goalId, String topicId,
                                       String subtopicId, boolean completed) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        Subtopic subtopic = findSubtopicById(topic, subtopicId);
        subtopic.setCompleted(completed);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Add a sub-subtopic (problem) under a subtopic. */
    public GoalResponse addSubSubtopic(String email, String goalId, String topicId,
                                       String subtopicId, SubtopicRequest request) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        Subtopic parentSubtopic = findSubtopicById(topic, subtopicId);
        Subtopic child = buildSubtopic(request);
        parentSubtopic.getSubtopics().add(child);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Delete a subtopic from a topic. */
    public GoalResponse deleteSubtopic(String email, String goalId, String topicId, String subtopicId) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        boolean removed = topic.getSubtopics().removeIf(s -> subtopicId.equals(s.getId()));
        if (!removed) {
            for (Subtopic s : topic.getSubtopics()) {
                if (s.getSubtopics() != null && s.getSubtopics().removeIf(c -> subtopicId.equals(c.getId()))) {
                    removed = true;
                    break;
                }
            }
        }
        if (!removed) {
            throw new ResourceNotFoundException("Subtopic not found: " + subtopicId);
        }
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /* ══════════════════════════════════════════════════════════
       RESOURCE LINK OPERATIONS (At all 3 levels)
       ══════════════════════════════════════════════════════════ */

    /** Add resource to goal. */
    public GoalResponse addGoalResource(String email, String goalId, ResourceLinkRequest req) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        ResourceLink link = buildSingleResourceLink(req);
        goal.getResources().add(link);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Update resource on goal. */
    public GoalResponse updateGoalResource(String email, String goalId, String resourceId, ResourceLinkRequest req) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        ResourceLink link = findResourceById(goal.getResources(), resourceId);
        applyResourceRequest(link, req);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Delete resource from goal. */
    public GoalResponse deleteGoalResource(String email, String goalId, String resourceId) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        boolean removed = goal.getResources().removeIf(r -> resourceId.equals(r.getId()));
        if (!removed) {
            throw new ResourceNotFoundException("Resource not found: " + resourceId);
        }
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Add resource to topic. */
    public GoalResponse addTopicResource(String email, String goalId, String topicId, ResourceLinkRequest req) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        ResourceLink link = buildSingleResourceLink(req);
        topic.getResources().add(link);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Update resource on topic. */
    public GoalResponse updateTopicResource(String email, String goalId, String topicId, String resourceId, ResourceLinkRequest req) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        ResourceLink link = findResourceById(topic.getResources(), resourceId);
        applyResourceRequest(link, req);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Delete resource from topic. */
    public GoalResponse deleteTopicResource(String email, String goalId, String topicId, String resourceId) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        boolean removed = topic.getResources().removeIf(r -> resourceId.equals(r.getId()));
        if (!removed) {
            throw new ResourceNotFoundException("Resource not found: " + resourceId);
        }
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Add resource to subtopic. */
    public GoalResponse addSubtopicResource(String email, String goalId, String topicId, String subtopicId, ResourceLinkRequest req) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        Subtopic subtopic = findSubtopicById(topic, subtopicId);
        ResourceLink link = buildSingleResourceLink(req);
        subtopic.getResources().add(link);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Update resource on subtopic. */
    public GoalResponse updateSubtopicResource(String email, String goalId, String topicId, String subtopicId, String resourceId, ResourceLinkRequest req) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        Subtopic subtopic = findSubtopicById(topic, subtopicId);
        ResourceLink link = findResourceById(subtopic.getResources(), resourceId);
        applyResourceRequest(link, req);
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /** Delete resource from subtopic. */
    public GoalResponse deleteSubtopicResource(String email, String goalId, String topicId, String subtopicId, String resourceId) {
        String userId = resolveUserId(email);
        Goal goal = findGoalOwnedBy(goalId, userId);
        Topic topic = findTopicById(goal, topicId);
        Subtopic subtopic = findSubtopicById(topic, subtopicId);
        boolean removed = subtopic.getResources().removeIf(r -> resourceId.equals(r.getId()));
        if (!removed) {
            throw new ResourceNotFoundException("Resource not found: " + resourceId);
        }
        goal.setUpdatedAt(Instant.now());
        return toResponse(goalRepository.save(goal));
    }

    /* ══════════════════════════════════════════════════════════
       PRIVATE HELPERS — Build / Apply
       ══════════════════════════════════════════════════════════ */

    private void applyGoalRequest(Goal goal, GoalRequest req) {
        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            goal.setTitle(req.getTitle().trim());
        }
        if (req.getDescription() != null) {
            goal.setDescription(trimToNull(req.getDescription()));
        }
        if (req.getCategory() != null) {
            goal.setCategory(trimToNull(req.getCategory()));
        }
        if (req.getPriority() != null) {
            goal.setPriority(req.getPriority().trim().toUpperCase());
        }
        if (req.getStatus() != null) {
            goal.setStatus(normalizeStatus(req.getStatus()));
        }
        if (req.getStartDate() != null) {
            goal.setStartDate(req.getStartDate());
        }
        if (req.getTargetDate() != null) {
            goal.setTargetDate(req.getTargetDate());
        }
        if (req.getNotes() != null) {
            goal.setNotes(trimToNull(req.getNotes()));
        }
        if (req.getResources() != null) {
            goal.setResources(buildResourceLinks(req.getResources()));
        }
        if (req.getTopics() != null && !req.getTopics().isEmpty()) {
            goal.setTopics(buildTopics(req.getTopics()));
        }
    }

    private Topic buildTopic(TopicRequest req) {
        Topic topic = new Topic();
        topic.setId(UUID.randomUUID().toString());
        applyTopicRequest(topic, req);
        return topic;
    }

    private void applyTopicRequest(Topic topic, TopicRequest req) {
        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            topic.setTitle(req.getTitle().trim());
        }
        if (req.getDescription() != null) {
            topic.setDescription(trimToNull(req.getDescription()));
        }
        if (req.getNotes() != null) {
            topic.setNotes(trimToNull(req.getNotes()));
        }
        if (req.getResources() != null) {
            topic.setResources(buildResourceLinks(req.getResources()));
        }
        if (req.getSubtopics() != null && !req.getSubtopics().isEmpty()) {
            topic.setSubtopics(buildSubtopics(req.getSubtopics()));
        }
        topic.setOrderIndex(req.getOrderIndex());
    }

    private Subtopic buildSubtopic(SubtopicRequest req) {
        Subtopic subtopic = new Subtopic();
        subtopic.setId(UUID.randomUUID().toString());
        applySubtopicRequest(subtopic, req);
        return subtopic;
    }

    private void applySubtopicRequest(Subtopic subtopic, SubtopicRequest req) {
        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            subtopic.setTitle(req.getTitle().trim());
        }
        if (req.getDescription() != null) {
            subtopic.setDescription(trimToNull(req.getDescription()));
        }
        subtopic.setCompleted(req.isCompleted());
        if (req.getDifficulty() != null) {
            subtopic.setDifficulty(trimToNull(req.getDifficulty()));
        }
        if (req.getEstimatedMinutes() != null) {
            subtopic.setEstimatedMinutes(req.getEstimatedMinutes());
        }
        if (req.getNotes() != null) {
            subtopic.setNotes(trimToNull(req.getNotes()));
        }
        if (req.getResources() != null) {
            subtopic.setResources(buildResourceLinks(req.getResources()));
        }
        subtopic.setOrderIndex(req.getOrderIndex());
    }

    private ResourceLink buildSingleResourceLink(ResourceLinkRequest req) {
        ResourceLink link = new ResourceLink();
        link.setId(req.getId() != null ? req.getId() : UUID.randomUUID().toString());
        applyResourceRequest(link, req);
        return link;
    }

    private void applyResourceRequest(ResourceLink link, ResourceLinkRequest req) {
        link.setTitle(req.getTitle().trim());
        link.setUrl(req.getUrl().trim());
        link.setType(trimToNull(req.getType()));
        link.setDescription(trimToNull(req.getDescription()));
    }

    private List<ResourceLink> buildResourceLinks(List<ResourceLinkRequest> reqs) {
        if (reqs == null) return new ArrayList<>();
        return reqs.stream()
                .map(this::buildSingleResourceLink)
                .collect(Collectors.toList());
    }

    private List<Topic> buildTopics(List<TopicRequest> reqs) {
        if (reqs == null) return new ArrayList<>();
        return reqs.stream()
                .map(req -> {
                    Topic topic = new Topic();
                    topic.setId(req.getId() != null ? req.getId() : UUID.randomUUID().toString());
                    applyTopicRequest(topic, req);
                    return topic;
                })
                .collect(Collectors.toList());
    }

    private List<Subtopic> buildSubtopics(List<SubtopicRequest> reqs) {
        if (reqs == null) return new ArrayList<>();
        return reqs.stream()
                .map(req -> {
                    Subtopic subtopic = new Subtopic();
                    subtopic.setId(req.getId() != null ? req.getId() : UUID.randomUUID().toString());
                    applySubtopicRequest(subtopic, req);
                    return subtopic;
                })
                .collect(Collectors.toList());
    }

    /* ══════════════════════════════════════════════════════════
       PRIVATE HELPERS — Response Mapping
       ══════════════════════════════════════════════════════════ */

    private GoalResponse toResponse(Goal goal) {
        GoalResponse res = new GoalResponse();
        res.setId(goal.getId());
        res.setUserId(goal.getUserId());
        res.setTitle(goal.getTitle());
        res.setDescription(goal.getDescription());
        res.setCategory(goal.getCategory());
        res.setPriority(goal.getPriority());
        res.setStatus(goal.getStatus());
        res.setStartDate(goal.getStartDate());
        res.setTargetDate(goal.getTargetDate());
        res.setNotes(goal.getNotes());
        res.setResources(toResourceLinkResponses(goal.getResources()));

        List<TopicResponse> topicResponses = goal.getTopics().stream()
                .map(this::toTopicResponse)
                .collect(Collectors.toList());
        res.setTopics(topicResponses);

        List<Subtopic> allLeaves = new ArrayList<>();
        if (goal.getTopics() != null) {
            for (Topic t : goal.getTopics()) {
                allLeaves.addAll(getAllLeafSubtopics(t.getSubtopics()));
            }
        }

        long total = allLeaves.size();
        long completed = allLeaves.stream().filter(Subtopic::isCompleted).count();

        res.setTotalSubtopics((int) total);
        res.setCompletedSubtopics((int) completed);
        res.setProgress(total == 0 ? -1 : (int) (completed * 100 / total));
        res.setCreatedAt(goal.getCreatedAt());
        res.setUpdatedAt(goal.getUpdatedAt());
        return res;
    }

    private TopicResponse toTopicResponse(Topic topic) {
        TopicResponse res = new TopicResponse();
        res.setId(topic.getId());
        res.setTitle(topic.getTitle());
        res.setDescription(topic.getDescription());
        res.setNotes(topic.getNotes());
        res.setResources(toResourceLinkResponses(topic.getResources()));
        res.setOrderIndex(topic.getOrderIndex());

        List<SubtopicResponse> subtopicResponses = topic.getSubtopics().stream()
                .map(this::toSubtopicResponse)
                .collect(Collectors.toList());
        res.setSubtopics(subtopicResponses);

        List<Subtopic> leaves = getAllLeafSubtopics(topic.getSubtopics());
        long total = leaves.size();
        long completed = leaves.stream().filter(Subtopic::isCompleted).count();
        res.setTotalSubtopics((int) total);
        res.setCompletedSubtopics((int) completed);
        res.setProgress(total == 0 ? -1 : (int) (completed * 100 / total));
        return res;
    }

    private SubtopicResponse toSubtopicResponse(Subtopic subtopic) {
        SubtopicResponse res = new SubtopicResponse();
        res.setId(subtopic.getId());
        res.setTitle(subtopic.getTitle());
        res.setDescription(subtopic.getDescription());
        res.setCompleted(subtopic.isCompleted());
        res.setProgress(subtopic.isCompleted() ? 100 : 0);
        res.setDifficulty(subtopic.getDifficulty());
        res.setEstimatedMinutes(subtopic.getEstimatedMinutes());
        res.setNotes(subtopic.getNotes());
        res.setResources(toResourceLinkResponses(subtopic.getResources()));
        res.setOrderIndex(subtopic.getOrderIndex());

        if (subtopic.getSubtopics() != null && !subtopic.getSubtopics().isEmpty()) {
            List<SubtopicResponse> childResponses = subtopic.getSubtopics().stream()
                    .map(this::toSubtopicResponse)
                    .collect(Collectors.toList());
            res.setSubtopics(childResponses);
            long comp = subtopic.getSubtopics().stream().filter(Subtopic::isCompleted).count();
            res.setProgress((int) (comp * 100 / subtopic.getSubtopics().size()));
            res.setCompleted(comp == subtopic.getSubtopics().size());
        }
        return res;
    }

    private List<ResourceLinkResponse> toResourceLinkResponses(List<ResourceLink> links) {
        if (links == null) return new ArrayList<>();
        return links.stream().map(link -> {
            ResourceLinkResponse r = new ResourceLinkResponse();
            r.setId(link.getId());
            r.setTitle(link.getTitle());
            r.setUrl(link.getUrl());
            r.setType(link.getType());
            r.setDescription(link.getDescription());
            return r;
        }).collect(Collectors.toList());
    }

    /* ══════════════════════════════════════════════════════════
       PROGRESS CALCULATION
       ══════════════════════════════════════════════════════════ */

    private List<Subtopic> getAllLeafSubtopics(List<Subtopic> subtopics) {
        List<Subtopic> leaves = new ArrayList<>();
        if (subtopics == null) return leaves;
        for (Subtopic s : subtopics) {
            if (s.getSubtopics() != null && !s.getSubtopics().isEmpty()) {
                leaves.addAll(getAllLeafSubtopics(s.getSubtopics()));
            } else {
                leaves.add(s);
            }
        }
        return leaves;
    }

    /* ══════════════════════════════════════════════════════════
       PRIVATE HELPERS — Lookup & Normalization
       ══════════════════════════════════════════════════════════ */

    private String resolveUserId(String email) {
        String normalised = (email != null) ? email.toLowerCase().trim() : "";
        return userRepository.findByEmail(normalised)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email))
                .getId();
    }

    private Goal findGoalOwnedBy(String goalId, String userId) {
        return goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found: " + goalId));
    }

    private Topic findTopicById(Goal goal, String topicId) {
        return goal.getTopics().stream()
                .filter(t -> topicId.equals(t.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicId));
    }

    private Subtopic findSubtopicById(Topic topic, String subtopicId) {
        if (topic.getSubtopics() != null) {
            for (Subtopic s : topic.getSubtopics()) {
                if (subtopicId.equals(s.getId())) return s;
                if (s.getSubtopics() != null) {
                    for (Subtopic child : s.getSubtopics()) {
                        if (subtopicId.equals(child.getId())) return child;
                    }
                }
            }
        }
        throw new ResourceNotFoundException("Subtopic not found: " + subtopicId);
    }

    private ResourceLink findResourceById(List<ResourceLink> list, String resourceId) {
        if (list == null) throw new ResourceNotFoundException("Resource not found: " + resourceId);
        return list.stream()
                .filter(r -> resourceId.equals(r.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + resourceId));
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) return "ACTIVE";
        String s = status.trim().toUpperCase();
        return switch (s) {
            case "PAUSED", "ON_HOLD" -> "PAUSED";
            case "COMPLETED" -> "COMPLETED";
            case "NOT_STARTED" -> "NOT_STARTED";
            default -> "ACTIVE"; // maps ACTIVE, IN_PROGRESS
        };
    }

    private String trimToNull(String str) {
        if (str == null || str.isBlank()) return null;
        return str.trim();
    }
}
