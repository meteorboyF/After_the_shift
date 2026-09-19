package com.aftertheshift.checkin;

/**
 * Which 12-hour shift the entry belongs to.
 *
 * This describes the duty, not the person. There is deliberately no field
 * anywhere on a check-in for a mood, a rating or a sentiment.
 */
public enum ShiftType {
    DAY,
    NIGHT
}
