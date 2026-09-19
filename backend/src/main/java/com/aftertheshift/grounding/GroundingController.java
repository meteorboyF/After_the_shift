package com.aftertheshift.grounding;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Task 2's only endpoint.
 *
 * Note what is missing: this controller does not read the X-Guard-Id header,
 * and there is no GET. Nothing written here can be listed, filtered by person,
 * or read back at all. It is write-only by design.
 */
@RestController
@RequestMapping("/api/grounding")
public class GroundingController {

    private final GroundingRepository repository;
    private final ZoneId zone;

    public GroundingController(GroundingRepository repository,
                               @Value("${app.timezone:Asia/Dhaka}") String timezone) {
        this.repository = repository;
        this.zone = ZoneId.of(timezone);
    }

    public record CompleteRequest(
            @NotNull ExerciseType exerciseType,
            boolean completed,
            @PositiveOrZero Integer abandonedAtSec) {
    }

    @PostMapping("/complete")
    public ResponseEntity<Void> complete(@Valid @RequestBody CompleteRequest request) {
        // The day is taken from the server clock rather than the request, so a
        // caller cannot supply a precise time and quietly make the row
        // identifiable.
        repository.save(GroundingCompletion.builder()
                .exerciseType(request.exerciseType())
                .completed(request.completed())
                .abandonedAtSec(request.abandonedAtSec())
                .day(LocalDate.now(zone))
                .build());

        // No body: there is nothing to return that would not be an invitation
        // to start reading this data back.
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
