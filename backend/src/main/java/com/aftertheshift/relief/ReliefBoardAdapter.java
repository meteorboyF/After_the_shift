package com.aftertheshift.relief;

import com.aftertheshift.supervisor.ReliefBoardPort;
import com.aftertheshift.supervisor.ReliefCard;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * The one place relief data is narrowed for a supervisor.
 *
 * This adapter lives on the relief side of the wall, not the supervisor side —
 * the package that owns the sensitive fields is the package responsible for not
 * handing them over. ReliefCard has no slot for the guard id, the reason audio
 * or the transcript, so this mapping cannot accidentally widen.
 */
@Component
public class ReliefBoardAdapter implements ReliefBoardPort {

    private final ReliefRepository repository;

    public ReliefBoardAdapter(ReliefRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReliefCard> listAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(request -> new ReliefCard(
                        request.getId(),
                        request.getType().name(),
                        request.getCreatedAt(),
                        request.getStatus().name()))
                .toList();
    }

    @Override
    public boolean isKnownStatus(String status) {
        for (ReliefStatus known : ReliefStatus.values()) {
            if (known.name().equals(status)) return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean updateStatus(Long id, String status) {
        if (!isKnownStatus(status)) return false;
        return repository.findById(id)
                .map(request -> {
                    request.setStatus(ReliefStatus.valueOf(status));
                    repository.save(request);
                    return true;
                })
                .orElse(false);
    }
}
