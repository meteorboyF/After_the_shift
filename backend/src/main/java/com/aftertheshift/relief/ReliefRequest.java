package com.aftertheshift.relief;

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
 * The only thing in this app that crosses into the hierarchy.
 *
 * Note the shape of that crossing: a supervisor sees id, type, createdAt and
 * status. The guard id and the spoken reason live on this row but are never
 * handed across — see supervisor.ReliefCard, which has no field to put them in.
 *
 * Column names are spelled out because TYPE and STATUS are risky bare words in
 * H2, and a failed CREATE TABLE only surfaces as a startup WARN.
 */
@Entity
@Table(name = "relief_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReliefRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Never leaves this package. */
    @Column(name = "guard_id", nullable = false)
    private String guardId;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false)
    private ReliefType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_status", nullable = false)
    private ReliefStatus status;

    /**
     * Optional, and optional by default — screen 3B makes "send without a
     * reason" the filled primary. Never shown to a supervisor.
     */
    @Lob
    @Column(name = "reason_audio", columnDefinition = "CLOB")
    private String reasonAudioBase64;

    @Lob
    @Column(name = "reason_transcript", columnDefinition = "CLOB")
    private String reasonTranscript;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
