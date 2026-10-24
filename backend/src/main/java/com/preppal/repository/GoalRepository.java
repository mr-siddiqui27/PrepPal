package com.preppal.repository;

import com.preppal.model.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data repository for the {@code goals} MongoDB collection.
 * All queries are scoped by {@code userId} to enforce ownership.
 */
public interface GoalRepository extends MongoRepository<Goal, String> {

    List<Goal> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Goal> findByIdAndUserId(String id, String userId);

    boolean existsByIdAndUserId(String id, String userId);

    void deleteByIdAndUserId(String id, String userId);
}
