package com.aftertheshift.checkin.dto;

import com.aftertheshift.checkin.ShiftType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.Instant;
import java.util.List;

public final class CheckInDtos {

    private CheckInDtos() {
    }

    /**
     * Audio and transcript are both optional. A browser with no Bangla speech
     * recognition still records and saves; a guard whose mic was refused still
     * gets an entry. The user is never blocked.
     */
    public record CreateRequest(
            String audioBase64,
            String transcript,
            @PositiveOrZero int durationSec,
            @NotNull ShiftType shiftType,
            @NotNull Instant recordedAt) {
    }

    public record CheckInResponse(
            Long id,
            String audioBase64,
            String transcript,
            int durationSec,
            ShiftType shiftType,
            Instant recordedAt) {
    }

    /**
     * The visible result of checking in — the thing P7 said was missing when he
     * rejected expression outright.
     *
     * `week` is seven days ending today, oldest first. `heaviestHour` is the
     * hour of day the guard most often records at, or null before there is
     * enough to say. No streak, no percentage, no score.
     */
    public record SummaryResponse(
            List<Boolean> week,
            Integer heaviestHour,
            long totalCount) {
    }
}
