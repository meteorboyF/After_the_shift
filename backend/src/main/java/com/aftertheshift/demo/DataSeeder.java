package com.aftertheshift.demo;

import com.aftertheshift.checkin.CheckIn;
import com.aftertheshift.checkin.CheckInRepository;
import com.aftertheshift.checkin.ShiftType;
import com.aftertheshift.common.Guards;
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
}
