package com.preppal.repository;

import com.preppal.model.StudentProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Data access for {@link StudentProfile} MongoDB documents.
 */
@Repository
public interface StudentProfileRepository extends MongoRepository<StudentProfile, String> {

    Optional<StudentProfile> findByUserId(String userId);

    Optional<StudentProfile> findByEmail(String email);

    boolean existsByUserId(String userId);
}
