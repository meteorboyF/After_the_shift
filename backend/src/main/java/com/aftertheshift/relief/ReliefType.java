package com.aftertheshift.relief;

/**
 * P8's own words, when asked to design a wellbeing system: "if someone else
 * could be placed there and I could be moved to another post for half an hour,
 * then I would get a little rest."
 *
 * The relief guards asked for is logistical, not expressive. Do not rename
 * these into generic wellness categories.
 */
public enum ReliefType {
    /** আধা ঘণ্টা বিশ্রাম — half an hour of rest */
    REST_HALF_HOUR,
    /** পোস্ট বদল — a change of post */
    POST_CHANGE,
    /** ছায়ায় পোস্ট — a post in the shade */
    SHADE_POST
}
