package com.aftertheshift;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.lang.reflect.RecordComponent;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * The privacy wall, asserted.
 *
 * Rule 5 says nothing from Task 1 or Task 2 may ever reach a supervisor. A
 * comment saying so is worth nothing once someone adds a convenient endpoint
 * six months later, so this test fails the build instead.
 *
 * It reads source rather than bytecode deliberately: the claim being made is
 * about what the supervisor package is *allowed to know about*, and an import
 * is the honest unit of that.
 */
class PrivacyWallTest {

    private static final Path SUPERVISOR =
            Path.of("src/main/java/com/aftertheshift/supervisor");

    private static List<Path> supervisorSources() throws IOException {
        try (Stream<Path> files = Files.walk(SUPERVISOR)) {
            return files.filter(p -> p.toString().endsWith(".java")).toList();
        }
    }

    @Test
    @DisplayName("supervisor package imports nothing from any feature package")
    void supervisorImportsNoFeaturePackage() throws IOException {
        List<Path> sources = supervisorSources();
        assertFalse(sources.isEmpty(), "no supervisor sources found — has the package moved?");

        for (Path source : sources) {
            for (String line : Files.readAllLines(source)) {
                String trimmed = line.trim();
                if (!trimmed.startsWith("import ")) continue;

                for (String forbidden : List.of(
                        "com.aftertheshift.checkin",
                        "com.aftertheshift.grounding",
                        "com.aftertheshift.relief",
                        "com.aftertheshift.demo")) {
                    assertFalse(
                            trimmed.contains(forbidden),
                            source.getFileName() + " imports " + forbidden
                                    + ". The supervisor side must not be able to name a guard's "
                                    + "check-ins, grounding exercises, or relief internals. "
                                    + "Depend on ReliefBoardPort instead.");
                }
            }
        }
    }

    /**
     * Comments are stripped before scanning. The doc comments in this package
     * deliberately name the things being excluded ("no field for a transcript"),
     * and flagging that prose would make the test punish its own documentation.
     * What matters is whether the *code* can name these types.
     */
    private static String codeOnly(String source) {
        return source
                .replaceAll("(?s)/\\*.*?\\*/", " ")
                .replaceAll("(?m)//.*$", " ");
    }

    @Test
    @DisplayName("supervisor code never names a check-in or grounding type")
    void supervisorNamesNoPrivateType() throws IOException {
        for (Path source : supervisorSources()) {
            String body = codeOnly(Files.readString(source));
            for (String forbidden :
                    List.of("CheckIn", "Grounding", "ShiftType", "transcript", "audioBase64")) {
                assertFalse(
                        body.contains(forbidden),
                        source.getFileName() + " mentions '" + forbidden
                                + "'. Nothing on the supervisor side should know this exists.");
            }
        }
    }

    @Test
    @DisplayName("ReliefCard carries exactly the four permitted fields")
    void reliefCardIsExactlyFourFields() {
        Set<String> allowed = Set.of("id", "type", "createdAt", "status");

        RecordComponent[] components =
                com.aftertheshift.supervisor.ReliefCard.class.getRecordComponents();

        assertTrue(components.length == allowed.size(),
                "ReliefCard should expose exactly " + allowed + " but has "
                        + Stream.of(components).map(RecordComponent::getName).toList());

        for (RecordComponent component : components) {
            assertTrue(allowed.contains(component.getName()),
                    "ReliefCard exposes '" + component.getName()
                            + "', which a supervisor must never receive.");
        }
    }

    @Test
    @DisplayName("GroundingCompletion has no guard column and no finer-than-day time")
    void groundingStaysAnonymous() {
        var fields = com.aftertheshift.grounding.GroundingCompletion.class.getDeclaredFields();

        for (var field : fields) {
            String name = field.getName().toLowerCase();
            assertFalse(name.contains("guard") || name.contains("user"),
                    "GroundingCompletion gained a '" + field.getName()
                            + "' field. It is an anonymous tally and must stay one.");
            assertFalse(field.getType().equals(java.time.Instant.class),
                    "GroundingCompletion field '" + field.getName()
                            + "' is an Instant. Day granularity only — a precise time "
                            + "re-identifies a guard by correlation with a roster.");
        }
    }
}
