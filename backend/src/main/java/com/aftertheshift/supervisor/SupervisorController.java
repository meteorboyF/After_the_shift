package com.aftertheshift.supervisor;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The supervisor side, in full. Two endpoints, both about relief requests.
 *
 * There is no endpoint here for check-ins or grounding, and there is no way to
 * add one without first adding a dependency this package does not have. That is
 * the point: P6 said "if they see it, then they take our statement", and a
 * promise that rests on a UI route being hidden is not a promise.
 */
@RestController
@RequestMapping("/api/supervisor")
public class SupervisorController {

    private final ReliefBoardPort board;

    public SupervisorController(ReliefBoardPort board) {
        this.board = board;
    }

    public record StatusUpdate(@NotBlank String status) {
    }

    @org.springframework.web.bind.annotation.GetMapping("/relief")
    public List<ReliefCard> relief() {
        return board.listAll();
    }

    @PatchMapping("/relief/{id}")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id,
                                             @RequestBody StatusUpdate update) {
        if (update == null || update.status() == null || !board.isKnownStatus(update.status())) {
            return ResponseEntity.badRequest().build();
        }
        return board.updateStatus(id, update.status())
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
