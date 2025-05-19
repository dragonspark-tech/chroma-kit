/**
 * Conversion factor from degrees to radians.
 *
 * This constant equals π/180 and is used to convert angle measurements
 * from degrees to radians for trigonometric calculations in color difference formulas.
 */
export const DEG_TO_RAD = 0.017453292519943295;

/**
 * Conversion factor from radians to degrees.
 *
 * This constant equals 180/π and is used to convert angle measurements
 * from radians to degrees in color difference calculations.
 */
export const RAD_TO_DEG = 57.29577951308232;

/**
 * A constant used in the CIEDE2000 color difference formula.
 *
 * This value (25^7) is used in the calculation of the parametric weighting
 * functions that adjust the contributions of lightness, chroma, and hue
 * differences to the overall color difference.
 */
export const E2000_GFACTOR = 6103515625;

/**
 * Approximation scaling factor for the OKLab color space for deltaE computation.
 * @see {@link <https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-945714988>}
 */
export const APPRX_OKLAB_SCALING = 2.0;

/**
 * Scaling factor derived from testing in the Combvd dataset for the OKLab color space for deltaE computation.
 *
 * @see {@link <https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-945714988>}
 * @see {@link <https://opg.optica.org/josaa/abstract.cfm?uri=josaa-25-7-1828>}
 */
export const COMBVD_OKLAB_SCALING = 2.016;

/**
 * Scaling factor derived from testing in the OSA-UCS dataset for the OKLab color space for deltaE computation.
 *
 * @see {@link <https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-945714988>}
 * @see {@link <https://www.osapublishing.org/josa/abstract.cfm?uri=josa-64-12-1691>}
 */
export const OSAUCS_OKLAB_SCALING = 2.045;

/**
 * An object containing scaling factors for the OKLab color space, used to calculate
 * color differences (Delta E) based on various methodologies or approximations.
 *
 * Properties:
 * - `approximate`: Represents the scaling factors based on an approximate approach
 *   for OKLab color difference calculations.
 * - `combvd`: Represents the scaling factors derived from the COMBVD (Combined Visual
 *   Differences) method for assessing color differences in the OKLab color space.
 * - `osaucs`: Represents the scaling factors based on OSA-UCS (Optical Society of
 *   America Uniform Color Scales) for OKLab-related color difference calculations.
 *
 * These scaling factors adjust the contribution of color attributes (lightness,
 * chroma, and hue) when computing the perceived differences in colors, allowing
 * for different models and their corresponding accuracy.
 */
export const OKLAB_DELTAE_SCALING = {
  approximate: APPRX_OKLAB_SCALING,
  combvd: COMBVD_OKLAB_SCALING,
  osaucs: OSAUCS_OKLAB_SCALING
};
