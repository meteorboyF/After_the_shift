package com.aftertheshift.checkin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A spoken post-shift entry.
 *
 * Belongs to exactly one guard and is readable only by that guard. Nothing in
 * the supervisor package can reach this table — see the package layout: the
 * supervisor code has no dependency on this repository at all.
 *
 * Note there is no mood, score, tag or sentiment column, and there never
 * should be. The entry is about the shift that happened, not about how the
 * guard rates themselves.
 */
@Entity
@Table(name = "check_ins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String guardId;

    /** The recording itself. Optional — a failed mic should not lose the entry. */
    @Lob
    @Column(columnDefinition = "CLOB")
    private String audioBase64;

    /** Absent whenever the browser has no Bangla speech recognition. */
    @Lob
    @Column(columnDefinition = "CLOB")
    private String transcript;

    private int durationSec;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShiftType shiftType;

    @Column(nullable = false)
    private Instant recordedAt;
}
