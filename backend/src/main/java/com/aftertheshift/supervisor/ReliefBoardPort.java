package com.aftertheshift.supervisor;

import java.util.List;

/**
 * The entire surface the supervisor side is allowed to reach.
 *
 * Dependency runs inward: this package declares the narrow thing it needs, and
 * the relief package implements it. The supervisor code therefore imports
 * nothing from relief, checkin or grounding — it could not query a check-in if
 * someone tried, because it holds no repository and knows no entity.
 *
 * Adding a method here that returns anything richer than a ReliefCard would be
 * the moment the wall comes down. Don't.
 */
public interface ReliefBoardPort {

    /** Every request, from every guard, reduced to four fields. */
    List<ReliefCard> listAll();

    /**
     * @return false if the id is unknown or the status is not a real one, which
     *         the controller turns into a 404 / 400 respectively.
     */
    boolean updateStatus(Long id, String status);

    boolean isKnownStatus(String status);
}
