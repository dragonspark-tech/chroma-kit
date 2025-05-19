/**
 * Low luminance offset value used in WCAG 2.1 contrast calculations.
 *
 * This constant represents the 5% viewing flare contribution added to both
 * luminance values in the WCAG 2.1 contrast ratio formula. It accounts for
 * the effect of ambient light reflecting off the display surface, which
 * reduces the perceived contrast.
 *
 * The value 0.05 (5%) was determined through empirical research to approximate
 * typical viewing conditions for displays.
 *
 * @see {contrastWCAG21} function where this constant is used
 */
export const WCAG21_LUMINANCE_OFFSET = 0.05;
