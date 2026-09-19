package com.aftertheshift.common;

/**
 * There is no account system and no server-side auth — this is a course
 * prototype. A guard is identified by an opaque id carried in a header, which
 * is enough to make "your own entries only" a real query constraint rather than
 * a comment.
 */
public final class Guards {

    /** The seeded demo guard. Also the fallback when no header is sent. */
    public static final String DEMO_GUARD_ID = "demo-guard";

    public static final String HEADER = "X-Guard-Id";

    private Guards() {
    }
}
