package com.aftertheshift.grounding;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * An anonymous tally row. Nothing more.
 *
 * Screen 2D tells the guard "এটা কোথাও লেখা হয়নি" — this was not recorded
 * anywhere — and that has to survive inspection of the schema, not just the UI.
 * So, by deliberate construction:
 *
 *   - There is NO guard id, and no foreign key of any kind. Nothing joins this
 *     table to a person. Do not add one.
 *   - The date is a LocalDate, not an Instant. Day granularity only: a precise
 *     timestamp would re-identify a guard by correlating it with a shift roster
 *     or a check-in, which is exactly what removing the user id is meant to
 *     prevent.
 *
 * Taken together, a row here says "somebody did a breathing exercise that day"
 * and cannot be narrowed further.
 */
@Entity
@Table(name = "grounding_completions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroundingCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExerciseType exerciseType;

    private boolean completed;

    /** Where the guard left off, if they left early. Not a judgement. */
    private Integer abandonedAtSec;

    /**
     * Day only — see the class comment. Never widen this to a timestamp.
     *
     * Mapped to "completed_on" because DAY is a reserved word in H2: left as
     * "day" the CREATE TABLE fails, and Hibernate reports that only as a
     * startup WARN, so the first insert is what actually surfaces it.
     */
    @Column(name = "completed_on", nullable = false)
    private LocalDate day;
}
