package com.aftertheshift.relief.dto;

import com.aftertheshift.relief.ReliefStatus;
import com.aftertheshift.relief.ReliefType;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public final class ReliefDtos {

    private ReliefDtos() {
    }

    /**
     * The reason is optional and is expected to be absent — screen 3B offers
     * "send without a reason" as the filled primary action, above the option to
     * attach one.
     *
     * `createdAt` is accepted so a request composed offline keeps the time the
     * guard actually made it, rather than the time the phone happened to
     * reconnect. Absent, the server stamps it.
     */
    public record CreateRequest(
            @NotNull ReliefType type,
            String reasonAudioBase64,
            String reasonTranscript,
            Instant createdAt) {
    }

    /** What the guard sees about their own request — including their reason. */
    public record ReliefResponse(
            Long id,
            ReliefType type,
            ReliefStatus status,
            String reasonAudioBase64,
            String reasonTranscript,
            Instant createdAt) {
    }

    /**
     * The tally on screen 3D. This is the answer to P7, who saw no benefit in
     * expression: it is the app showing that asking produced something.
     */
    public record SummaryResponse(long monthCount, long acceptedCount) {
    }
}
