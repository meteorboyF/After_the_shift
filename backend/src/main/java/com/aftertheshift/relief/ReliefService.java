package com.aftertheshift.relief;

import com.aftertheshift.relief.dto.ReliefDtos.CreateRequest;
import com.aftertheshift.relief.dto.ReliefDtos.ReliefResponse;
import com.aftertheshift.relief.dto.ReliefDtos.SummaryResponse;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReliefService {

    private final ReliefRepository repository;
    private final ZoneId zone;

    public ReliefService(ReliefRepository repository,
                         @Value("${app.timezone:Asia/Dhaka}") String timezone) {
        this.repository = repository;
        this.zone = ZoneId.of(timezone);
    }

    @Transactional
    public ReliefResponse create(String guardId, CreateRequest request) {
        ReliefRequest saved = repository.save(ReliefRequest.builder()
                .guardId(guardId)
                .type(request.type())
                .status(ReliefStatus.PENDING)
                .reasonAudioBase64(request.reasonAudioBase64())
                .reasonTranscript(request.reasonTranscript())
                .createdAt(request.createdAt() != null ? request.createdAt() : Instant.now())
                .build());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReliefResponse> listOwn(String guardId) {
        return repository.findByGuardIdOrderByCreatedAtDesc(guardId).stream()
                .map(ReliefService::toResponse)
                .toList();
    }

    /** Withdrawing. Asking for rest is never irreversible. */
    @Transactional
    public boolean withdraw(String guardId, Long id) {
        return repository.findByIdAndGuardId(id, guardId)
                .map(request -> {
                    repository.delete(request);
                    return true;
                })
                .orElse(false);
    }

    /** "এই মাসে ৫টি অনুরোধ / ৪টি গ্রহণ করা হয়েছে" — this month, not all time. */
    @Transactional(readOnly = true)
    public SummaryResponse summary(String guardId) {
        Instant monthStart = LocalDate.now(zone)
                .withDayOfMonth(1)
                .atStartOfDay(zone)
                .toInstant();

        return new SummaryResponse(
                repository.countByGuardIdAndCreatedAtAfter(guardId, monthStart),
                repository.countByGuardIdAndStatusAndCreatedAtAfter(
                        guardId, ReliefStatus.ACCEPTED, monthStart));
    }

    private static ReliefResponse toResponse(ReliefRequest request) {
        return new ReliefResponse(
                request.getId(),
                request.getType(),
                request.getStatus(),
                request.getReasonAudioBase64(),
                request.getReasonTranscript(),
                request.getCreatedAt());
    }
}
