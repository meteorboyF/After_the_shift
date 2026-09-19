package com.aftertheshift.relief;

public enum ReliefStatus {
    PENDING,
    ACCEPTED,
    /** Rendered in warn ochre, never red, and never asks the guard to justify it. */
    REJECTED
}
