/**
 * Minimum contrast ratio for AA compliance for normal text according to WCAG 2.1
 * This is used for text that is less than 18pt (24px) or 14pt (18.7px) bold
 */
export const WCAG21_AA_NORMAL_MIN_RATIO = 4.5;

/**
 * Minimum contrast ratio for AA compliance for large text according to WCAG 2.1
 * This is used for text that is at least 18pt (24px) or 14pt (18.7px) bold
 */
export const WCAG21_AA_LARGE_MIN_RATIO = 3;

/**
 * Minimum contrast ratio for AAA compliance for normal text according to WCAG 2.1
 * This is used for text that is less than 18pt (24px) or 14pt (18.7px) bold
 */
export const WCAG21_AAA_NORMAL_MIN_RATIO = 7;

/**
 * Minimum contrast ratio for AAA compliance for large text according to WCAG 2.1
 * This is used for text that is at least 18pt (24px) or 14pt (18.7px) bold
 */
export const WCAG21_AAA_LARGE_MIN_RATIO = 4.5;

/**
 * Minimum contrast ratio for body text according to APCA (Advanced Perceptual Contrast Algorithm)
 * Used for standard body text content
 */
export const APCA_BODY_MIN_RATIO = 60;

/**
 * Minimum contrast ratio for large text according to APCA
 * Used for headings and other large text elements
 */
export const APCA_LARGE_MIN_RATIO = 45;

/**
 * Minimum contrast ratio for placeholder or non-essential text according to APCA
 * Used for text that is not critical for understanding the content
 */
export const APCA_PLACEHOLDER_MIN_RATIO = 30;

/**
 * Minimum contrast ratio for UI elements according to APCA
 * Used for interactive elements like buttons, form controls, etc.
 */
export const APCA_UI_MIN_RATIO = 60;
