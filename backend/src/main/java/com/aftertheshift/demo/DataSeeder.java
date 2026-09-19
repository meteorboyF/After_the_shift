package com.aftertheshift.demo;

import com.aftertheshift.checkin.CheckIn;
import com.aftertheshift.checkin.CheckInRepository;
import com.aftertheshift.checkin.ShiftType;
import com.aftertheshift.common.Guards;
import com.aftertheshift.relief.ReliefRepository;
import com.aftertheshift.relief.ReliefRequest;
import com.aftertheshift.relief.ReliefStatus;
import com.aftertheshift.relief.ReliefType;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Populates the demo guard so no summary screen is empty during a presentation.
 *
 * Lives in its own package rather than in `common`, which the feature packages
 * already depend on — seeding is a demo concern and must not become something
 * the domain imports.
 *
 * Deliberately gappy: the seeded days are not consecutive. The week strip is
 * meant to show days with entries, not a streak, and seeding a perfect run
 * would quietly imply one.
 */
@Configuration
@Profile("demo")
public class DataSeeder {

    @Bean
    ApplicationRunner seedCheckIns(CheckInRepository checkIns,
                                   @Value("${app.timezone:Asia/Dhaka}") String timezone) {
        return args -> {
            if (checkIns.countByGuardId(Guards.DEMO_GUARD_ID) > 0) {
                return;
            }

            ZoneId zone = ZoneId.of(timezone);
            LocalDate today = LocalDate.now(zone);

            // Five entries across different hours. 9am recurs, so the derived
            // line on screen 1D reads "heaviest time — 9 AM".
            record Seed(int daysAgo, int hour, int minute, int durationSec, ShiftType shift) {
            }

            var seeds = new Seed[] {
                new Seed(1, 9, 12, 48, ShiftType.NIGHT),
                new Seed(2, 21, 40, 63, ShiftType.DAY),
                new Seed(3, 9, 5, 35, ShiftType.NIGHT),
                new Seed(5, 14, 22, 52, ShiftType.DAY),
                new Seed(6, 9, 51, 71, ShiftType.NIGHT),
            };

            for (Seed seed : seeds) {
                checkIns.save(CheckIn.builder()
                        .guardId(Guards.DEMO_GUARD_ID)
                        .audioBase64(null)
                        .transcript(null)
                        .durationSec(seed.durationSec())
                        .shiftType(seed.shift())
                        .recordedAt(today.minusDays(seed.daysAgo())
                                .atTime(LocalTime.of(seed.hour(), seed.minute()))
                                .atZone(zone)
                                .toInstant())
                        .build());
            }
        };
    }

    /**
     * Five requests this month, four accepted — so the tally on screen 3D reads
     * "এই মাসে ৫টি অনুরোধ / ৪টি গ্রহণ করা হয়েছে" during the demo.
     *
     * That tally is the answer to P7, who saw no benefit in expression. An
     * empty one would demonstrate his point rather than the counter-argument.
     *
     * All five are dated inside the current month, since the summary counts from
     * the first of the month; seeding "N days ago" would silently under-report
     * during the first week of a month.
     */
    @Bean
    ApplicationRunner seedRelief(ReliefRepository relief,
                                 @Value("${app.timezone:Asia/Dhaka}") String timezone) {
        return args -> {
            if (!relief.findByGuardIdOrderByCreatedAtDesc(Guards.DEMO_GUARD_ID).isEmpty()) {
                return;
            }

            ZoneId zone = ZoneId.of(timezone);
            LocalDate today = LocalDate.now(zone);
            LocalDate monthStart = today.withDayOfMonth(1);

            record Seed(int dayOfMonth, int hour, ReliefType type, ReliefStatus status) {
            }

            // Spread across the month but never later than today.
            var seeds = new Seed[] {
                new Seed(2, 14, ReliefType.SHADE_POST, ReliefStatus.ACCEPTED),
                new Seed(6, 11, ReliefType.REST_HALF_HOUR, ReliefStatus.ACCEPTED),
                new Seed(11, 16, ReliefType.POST_CHANGE, ReliefStatus.ACCEPTED),
                new Seed(15, 9, ReliefType.REST_HALF_HOUR, ReliefStatus.ACCEPTED),
                new Seed(18, 13, ReliefType.SHADE_POST, ReliefStatus.PENDING),
            };

            for (Seed seed : seeds) {
                LocalDate when = monthStart.plusDays(seed.dayOfMonth() - 1L);
                if (when.isAfter(today)) when = today;

                relief.save(ReliefRequest.builder()
                        .guardId(Guards.DEMO_GUARD_ID)
                        .type(seed.type())
                        .status(seed.status())
                        .reasonAudioBase64(null)
                        .reasonTranscript(null)
                        .createdAt(when.atTime(LocalTime.of(seed.hour(), 0))
                                .atZone(zone)
                                .toInstant())
                        .build());
            }
        };
    }
}
