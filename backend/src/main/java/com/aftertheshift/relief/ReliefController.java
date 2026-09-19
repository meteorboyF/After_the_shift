package com.aftertheshift.relief;

import com.aftertheshift.common.Guards;
import com.aftertheshift.relief.dto.ReliefDtos.CreateRequest;
import com.aftertheshift.relief.dto.ReliefDtos.ReliefResponse;
import com.aftertheshift.relief.dto.ReliefDtos.SummaryResponse;
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

/** Task 3, guard side. Scoped to the caller, like check-ins. */
@RestController
@RequestMapping("/api/relief")
public class ReliefController {

    private final ReliefService service;

    public ReliefController(ReliefService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ReliefResponse> create(
            @RequestHeader(value = Guards.HEADER, defaultValue = Guards.DEMO_GUARD_ID) String guardId,
            @Valid @RequestBody CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(guardId, request));
    }

    @GetMapping
    public List<ReliefResponse> listOwn(
            @RequestHeader(value = Guards.HEADER, defaultValue = Guards.DEMO_GUARD_ID) String guardId) {
        return service.listOwn(guardId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> withdraw(
            @RequestHeader(value = Guards.HEADER, defaultValue = Guards.DEMO_GUARD_ID) String guardId,
            @PathVariable Long id) {
        return service.withdraw(guardId, id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/summary")
    public SummaryResponse summary(
            @RequestHeader(value = Guards.HEADER, defaultValue = Guards.DEMO_GUARD_ID) String guardId) {
        return service.summary(guardId);
    }
}
