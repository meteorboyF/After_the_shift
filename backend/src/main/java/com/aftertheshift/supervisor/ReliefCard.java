package com.aftertheshift.supervisor;

import java.time.Instant;

/**
 * Everything a supervisor is ever given about a request. Four fields.
 *
 * This is the privacy wall expressed as a type. There is no field here for a
 * guard id, for the spoken reason, for a transcript, for a check-in, or for a
 * grounding exercise — so there is no mapper anywhere that could be edited, or
 * forgotten, to start leaking one. The data cannot reach this package because
 * it has nowhere to land.
 *
 * `type` and `status` are Strings rather than the relief enums on purpose: it
 * keeps this package free of any import from a feature package at all. See
 * PrivacyWallTest, which asserts exactly that.
 */
public record ReliefCard(
        Long id,
        String type,
        Instant createdAt,
        String status) {
}
