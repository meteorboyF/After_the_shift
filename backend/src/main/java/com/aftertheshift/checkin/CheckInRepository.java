package com.aftertheshift.checkin;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Every read is scoped by guardId. There is no findAll() convenience method on
 * purpose — a check-in is never listed across guards, by anyone, for any reason.
 */
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {

    List<CheckIn> findByGuardIdOrderByRecordedAtDesc(String guardId);

    Optional<CheckIn> findByIdAndGuardId(Long id, String guardId);

    long countByGuardId(String guardId);
}
