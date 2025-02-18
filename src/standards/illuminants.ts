/**
 * Represents an illuminant with specific properties defining its chromaticity coordinates and name.
 *
 * This type is used to describe standard illuminants in color science, typically characterized by their
 * x, y, and z chromaticity coordinates and a name identifier.
 *
 * Properties:
 * - `name`: The string identifier or name of the illuminant.
 * - `x`: The x chromaticity coordinate of the illuminant.
 * - `y`: The y chromaticity coordinate of the illuminant.
 * - `z`: The z chromaticity coordinate of the illuminant.
 *
 * @see https://en.wikipedia.org/wiki/Standard_illuminant
 */
export type Illuminant = {
  name: string;
  x: number;
  y: number;
  z: number;
}

/**
 * CIE standard illuminant A is intended to represent typical, domestic, tungsten-filament lighting.
 * Its relative spectral power distribution is that of a Planckian radiator at a temperature of approximately 2856 K.
 *
 * Illuminant A should be used in all applications of colorimetry involving the use of incandescent lighting,
 * unless there are specific reasons for using a different illuminant.
 *
 * @see https://cie.co.at/publications/colorimetry-part-2-cie-standard-illuminants-0
 */
export const IlluminantA: Illuminant = {
  name: 'A',
  x: 1.09850,
  y: 1.00000,
  z: 0.35585
};

/**
 * CIE standard illuminant D50 is intended to mathematically represent ‘horizon’ daylight in the early morning or late afternoon.
 * It's relative spectral power distribution is that of a blackbody radiator at a temperature of approximately 5000 K.
 *
 * Illuminant D50 should be used in colorimetric calculations where the use of such a correlated colour temperature is intended.
 * It's the most commonly used illuminant in the graphic arts industry.
 *
 * @see https://cie.co.at/publications/colorimetry-part-2-cie-standard-illuminants-0
 */
export const IlluminantD50: Illuminant = {
  name: 'D50',
  x: 0.96422,
  y: 1.00000,
  z: 0.82521
};

/**
 * CIE Standard illuminant D65 is intended to represent normal 'noon' daylight illumination in the environment.
 * Its relative spectral power distribution is that of a filtered tungsten halogen light source at a temperature of approximately 6500 K.
 *
 * Illuminant D65 should be used in all colorimetric calculations requiring representative outdoor daylight,
 * unless there are specific reasons for using a different spectral power distribution.
 *
 * It's the illuminant used in the sRGB color space.
 *
 * @see https://cie.co.at/publications/colorimetry-part-2-cie-standard-illuminants-0
 */
export const IlluminantD65: Illuminant = {
  name: 'D65',
  x: 0.95047,
  y: 1.00000,
  z: 1.08883
};