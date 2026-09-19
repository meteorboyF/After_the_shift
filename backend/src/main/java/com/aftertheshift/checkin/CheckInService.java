package com.aftertheshift.checkin;

import com.aftertheshift.checkin.dto.CheckInDtos.CheckInResponse;
import com.aftertheshift.checkin.dto.CheckInDtos.CreateRequest;
import com.aftertheshift.checkin.dto.CheckInDtos.SummaryResponse;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckInService {

    private final CheckInRepository repository;
    private final ZoneId zone;

    public CheckInService(CheckInRepository repository,
                          @Value("${app.timezone:Asia/Dhaka}") String timezone) {
        this.repository = repository;
        this.zone = ZoneId.of(timezone);
    }

    @Transactional
    public CheckInResponse create(String guardId, CreateRequest request) {
        CheckIn saved = repository.save(CheckIn.builder()
                .guardId(guardId)
                .audioBase64(request.audioBase64())
                .transcript(request.transcript())
                .durationSec(request.durationSec())
                .shiftType(request.shiftType())
                .recordedAt(request.recordedAt())
                .build());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CheckInResponse> listOwn(String guardId) {
        return repository.findByGuardIdOrderByRecordedAtDesc(guardId).stream()
                .map(CheckInService::toResponse)
                .toList();
    }

    /** Returns false when the entry does not exist *or* belongs to someone else. */
    @Transactional
    public boolean delete(String guardId, Long id) {
        return repository.findByIdAndGuardId(id, guardId)
                .map(entry -> {
                    repository.delete(entry);
                    return true;
                })
                .orElse(false);
    }

    /**
     * The week strip and the one derived line on screen 1D.
     *
     * Deliberately not computed here: any notion of a streak, a completion
     * percentage, or a missed day. Gaps in the week strip are just gaps.
     */
    @Transactional(readOnly = true)
    public SummaryResponse summary(String guardId) {
        List<CheckIn> entries = repository.findByGuardIdOrderByRecordedAtDesc(guardId);

        LocalDate today = LocalDate.now(zone);
        Set<LocalDate> daysWithEntries = new HashSet<>();
        Map<Integer, Integer> hourCounts = new HashMap<>();

        for (CheckIn entry : entries) {
            var local = entry.getRecordedAt().atZone(zone);
            daysWithEntries.add(local.toLocalDate());
            hourCounts.merge(local.getHour(), 1, Integer::sum);
        }

        // Seven days ending today, oldest first, so the strip reads left to right.
        List<Boolean> week = new ArrayList<>(7);
        for (int offset = 6; offset >= 0; offset--) {
            week.add(daysWithEntries.contains(today.minusDays(offset)));
        }

        Integer heaviestHour = hourCounts.entrySet().stream()
                .max(Comparator
                        .comparingInt(Map.Entry<Integer, Integer>::getValue)
                        // Ties resolve to the earlier hour so the line is stable
                        // between reloads rather than flipping around.
                        .thenComparing(Map.Entry::getKey, Comparator.reverseOrder()))
                .map(Map.Entry::getKey)
                .orElse(null);

        return new SummaryResponse(week, heaviestHour, repository.countByGuardId(guardId));
    }

    private static CheckInResponse toResponse(CheckIn entry) {
        return new CheckInResponse(
                entry.getId(),
                entry.getAudioBase64(),
                entry.getTranscript(),
                entry.getDurationSec(),
                entry.getShiftType(),
                entry.getRecordedAt());
    }
}
