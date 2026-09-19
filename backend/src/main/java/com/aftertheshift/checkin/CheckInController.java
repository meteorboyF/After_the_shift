package com.aftertheshift.checkin;

import com.aftertheshift.checkin.dto.CheckInDtos.CheckInResponse;
import com.aftertheshift.checkin.dto.CheckInDtos.CreateRequest;
import com.aftertheshift.checkin.dto.CheckInDtos.SummaryResponse;
import com.aftertheshift.common.Guards;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Task 1. Every route here is scoped to the calling guard.
 *
 * There is no endpoint that lists check-ins across guards, and none that a
 * supervisor could call — see com.aftertheshift.supervisor, which does not
 * import anything from this package.
 */
@RestController
@RequestMapping("/api/checkins")
public class CheckInController {

    private final CheckInService service;

    public CheckInController(CheckInService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CheckInResponse> create(
            @RequestHeader(value = Guards.HEADER, defaultValue = Guards.DEMO_GUARD_ID) String guardId,
            @Valid @RequestBody CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(guardId, request));
    }

    @GetMapping
    public List<CheckInResponse> listOwn(
            @RequestHeader(value = Guards.HEADER, defaultValue = Guards.DEMO_GUARD_ID) String guardId) {
        return service.listOwn(guardId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader(value = Guards.HEADER, defaultValue = Guards.DEMO_GUARD_ID) String guardId,
            @PathVariable Long id) {
        return service.delete(guardId, id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/summary")
    public SummaryResponse summary(
            @RequestHeader(value = Guards.HEADER, defaultValue = Guards.DEMO_GUARD_ID) String guardId) {
        return service.summary(guardId);
    }
}
