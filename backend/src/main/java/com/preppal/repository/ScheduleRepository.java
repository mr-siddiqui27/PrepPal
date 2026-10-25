package com.preppal.repository;

import com.preppal.model.ScheduleActivity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data repository for the {@code schedule_activities} MongoDB collection.
 * All queries are scoped by {@code userId} to enforce ownership.
 */
public interface ScheduleRepository extends MongoRepository<ScheduleActivity, String> {

    List<ScheduleActivity> findByUserIdAndScheduledDateBetweenOrderByScheduledDateAscStartTimeAsc(
            String userId, LocalDate startDate, LocalDate endDate);

    List<ScheduleActivity> findByUserIdAndScheduledDateOrderByStartTimeAsc(
            String userId, LocalDate date);

    Optional<ScheduleActivity> findByIdAndUserId(String id, String userId);

    void deleteByIdAndUserId(String id, String userId);

    List<ScheduleActivity> findByUserIdAndParentActivityId(String userId, String parentActivityId);
}
