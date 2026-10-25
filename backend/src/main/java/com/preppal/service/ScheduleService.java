package com.preppal.service;

import com.preppal.dto.ScheduleActivityRequest;
import com.preppal.dto.ScheduleActivityResponse;
import com.preppal.exception.ResourceNotFoundException;
import com.preppal.model.ScheduleActivity;
import com.preppal.repository.ScheduleRepository;
import com.preppal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Schedule activity operations.
 *
 * <h3>Ownership enforcement</h3>
 * Every operation resolves the authenticated user from their email
 * (extracted from the JWT principal), then uses {@code userId} for all
 * MongoDB queries. Clients cannot supply or spoof a userId.
 *
 * <h3>Recurrence</h3>
 * When an activity has a recurrence pattern (DAILY or WEEKLY), creating it
 * generates child activity documents for each recurrence date up to
 * recurrenceEndDate. Each child links back to the parent via parentActivityId.
 * Deleting the parent does NOT cascade-delete children (user manages individually).
 */
@Service
public class ScheduleService {

    private static final int MAX_RECURRENCE_INSTANCES = 52; // safety cap

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, UserRepository userRepository) {
        this.scheduleRepository = scheduleRepository;
        this.userRepository = userRepository;
    }

    /* ══════════════════════════════════════════════════════════
       ACTIVITY CRUD
       ══════════════════════════════════════════════════════════ */

    /** Get all activities for the authenticated user in a date range (ISO dates). */
    public List<ScheduleActivityResponse> getActivitiesForRange(
            String email, LocalDate startDate, LocalDate endDate) {
        String userId = resolveUserId(email);
        return scheduleRepository
                .findByUserIdAndScheduledDateBetweenOrderByScheduledDateAscStartTimeAsc(
                        userId, startDate, endDate)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /** Get activities for a single date. */
    public List<ScheduleActivityResponse> getActivitiesForDate(String email, LocalDate date) {
        String userId = resolveUserId(email);
        return scheduleRepository
                .findByUserIdAndScheduledDateOrderByStartTimeAsc(userId, date)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /** Create a new activity (with optional recurrence expansion). */
    public List<ScheduleActivityResponse> createActivity(String email, ScheduleActivityRequest request) {
        String userId = resolveUserId(email);

        ScheduleActivity parent = buildActivity(userId, request, null);
        ScheduleActivity savedParent = scheduleRepository.save(parent);

        List<ScheduleActivityResponse> results = new ArrayList<>();
        results.add(toResponse(savedParent));

        // Expand recurrence if needed
        if (!"NONE".equals(request.getRecurrence()) && request.getRecurrenceEndDate() != null) {
            List<LocalDate> dates = buildRecurrenceDates(
                    request.getScheduledDate(),
                    request.getRecurrence(),
                    request.getRecurrenceEndDate()
            );
            for (LocalDate date : dates) {
                ScheduleActivity child = buildActivity(userId, request, savedParent.getId());
                child.setScheduledDate(date);
                ScheduleActivity savedChild = scheduleRepository.save(child);
                results.add(toResponse(savedChild));
            }
        }

        return results;
    }

    /** Update an existing activity (status, title, times, etc.). */
    public ScheduleActivityResponse updateActivity(
            String email, String activityId, ScheduleActivityRequest request) {
        String userId = resolveUserId(email);
        ScheduleActivity activity = findActivityOwnedBy(activityId, userId);

        applyRequest(activity, request);
        activity.setUpdatedAt(Instant.now());

        return toResponse(scheduleRepository.save(activity));
    }

    /** Patch only the status of an activity. */
    public ScheduleActivityResponse updateStatus(String email, String activityId, String status) {
        String userId = resolveUserId(email);
        ScheduleActivity activity = findActivityOwnedBy(activityId, userId);
        activity.setStatus(status);
        activity.setUpdatedAt(Instant.now());
        return toResponse(scheduleRepository.save(activity));
    }

    /** Delete an activity. */
    public void deleteActivity(String email, String activityId) {
        String userId = resolveUserId(email);
        if (!scheduleRepository.findByIdAndUserId(activityId, userId).isPresent()) {
            throw new ResourceNotFoundException("Activity not found: " + activityId);
        }
        scheduleRepository.deleteByIdAndUserId(activityId, userId);
    }

    /* ══════════════════════════════════════════════════════════
       HELPERS
       ══════════════════════════════════════════════════════════ */

    private String resolveUserId(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email))
                .getId();
    }

    private ScheduleActivity findActivityOwnedBy(String activityId, String userId) {
        return scheduleRepository.findByIdAndUserId(activityId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Schedule activity not found or access denied: " + activityId));
    }

    private ScheduleActivity buildActivity(String userId, ScheduleActivityRequest request,
                                            String parentId) {
        ScheduleActivity a = new ScheduleActivity();
        a.setUserId(userId);
        a.setParentActivityId(parentId);
        applyRequest(a, request);
        return a;
    }

    private void applyRequest(ScheduleActivity a, ScheduleActivityRequest request) {
        a.setTitle(request.getTitle());
        a.setDescription(request.getDescription());
        a.setScheduledDate(request.getScheduledDate());
        a.setStartTime(request.getStartTime());
        a.setEndTime(request.getEndTime());
        a.setDurationMinutes(request.getDurationMinutes());
        a.setActivityType(request.getActivityType() != null ? request.getActivityType() : "PERSONAL");
        a.setStatus(request.getStatus() != null ? request.getStatus() : "PLANNED");
        a.setCategory(request.getCategory());
        a.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        a.setLinkedGoalId(request.getLinkedGoalId());
        a.setLinkedGoalTitle(request.getLinkedGoalTitle());
        a.setLinkedTopicId(request.getLinkedTopicId());
        a.setLinkedTopicTitle(request.getLinkedTopicTitle());
        a.setNavigationPath(request.getNavigationPath());
        a.setRecurrence(request.getRecurrence() != null ? request.getRecurrence() : "NONE");
        a.setRecurrenceEndDate(request.getRecurrenceEndDate());
    }

    /**
     * Returns the list of additional recurrence dates (excludes the original date).
     * Limited to MAX_RECURRENCE_INSTANCES for safety.
     */
    private List<LocalDate> buildRecurrenceDates(LocalDate start, String pattern, LocalDate endDate) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate current = start;
        int count = 0;

        while (count < MAX_RECURRENCE_INSTANCES) {
            switch (pattern) {
                case "DAILY" -> current = current.plusDays(1);
                case "WEEKLY" -> current = current.plusWeeks(1);
                default -> { return dates; }
            }
            if (current.isAfter(endDate)) break;
            dates.add(current);
            count++;
        }
        return dates;
    }

    private ScheduleActivityResponse toResponse(ScheduleActivity a) {
        ScheduleActivityResponse r = new ScheduleActivityResponse();
        r.setId(a.getId());
        r.setUserId(a.getUserId());
        r.setTitle(a.getTitle());
        r.setDescription(a.getDescription());
        r.setScheduledDate(a.getScheduledDate());
        r.setStartTime(a.getStartTime());
        r.setEndTime(a.getEndTime());
        r.setDurationMinutes(a.getDurationMinutes());
        r.setActivityType(a.getActivityType());
        r.setStatus(a.getStatus());
        r.setCategory(a.getCategory());
        r.setPriority(a.getPriority());
        r.setLinkedGoalId(a.getLinkedGoalId());
        r.setLinkedGoalTitle(a.getLinkedGoalTitle());
        r.setLinkedTopicId(a.getLinkedTopicId());
        r.setLinkedTopicTitle(a.getLinkedTopicTitle());
        r.setNavigationPath(a.getNavigationPath());
        r.setRecurrence(a.getRecurrence());
        r.setRecurrenceEndDate(a.getRecurrenceEndDate());
        r.setParentActivityId(a.getParentActivityId());
        r.setCreatedAt(a.getCreatedAt());
        r.setUpdatedAt(a.getUpdatedAt());
        return r;
    }
}
