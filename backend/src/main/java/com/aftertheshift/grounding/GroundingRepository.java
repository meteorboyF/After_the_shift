package com.aftertheshift.grounding;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * A counter, not a history. There is no finder here that takes a guard, because
 * the entity has no guard to take.
 */
public interface GroundingRepository extends JpaRepository<GroundingCompletion, Long> {
}
