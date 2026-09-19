package com.aftertheshift.relief;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReliefRepository extends JpaRepository<ReliefRequest, Long> {

    List<ReliefRequest> findByGuardIdOrderByCreatedAtDesc(String guardId);

    Optional<ReliefRequest> findByIdAndGuardId(Long id, String guardId);

    long countByGuardIdAndCreatedAtAfter(String guardId, Instant since);

    long countByGuardIdAndStatusAndCreatedAtAfter(String guardId, ReliefStatus status, Instant since);

    List<ReliefRequest> findAllByOrderByCreatedAtDesc();
}
