/**
 * Represents an illuminant with specific properties defining its chromaticity coordinates and name.
 *
 * This type is used to describe standard illuminants in color science, typically characterized by their
 * x, y, and z chromaticity coordinates and a name identifier.
 *
 * @see https://en.wikipedia.org/wiki/Standard_illuminant
 */
export interface Illuminant {
  name: string;
  xR: number;
  yR: number;
  zR: number;
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
  xR: 1.0985,
  yR: 1.0,
  zR: 0.35585
};

/**
 * CIE standard illuminant D50 is intended to mathematically represent ‘horizon’ daylight in the early morning or late afternoon.
 * It's relative spectral power distribution is that of a blackbody radiator at a temperature of approximately 5000 K.
 *
 * Illuminant D50 should be used in colorimetric calculations where the use of such a correlated color temperature is intended.
 * It's the most commonly used illuminant in the graphic arts industry.
 *
 * @see https://cie.co.at/publications/colorimetry-part-2-cie-standard-illuminants-0
 */
export const IlluminantD50: Illuminant = {
  name: 'D50',
  xR: 0.9642956764295677,
  yR: 1.0,
  zR: 0.8251046025104602
};

/**
 * CIE Standard illuminant D65 is intended to represent normal 'noon' daylight illumination in the environment.
 * Its relative spectral power distribution is that of a filtered tungsten halogen light source at a temperature of approximately 6500 K.
 *
 * Illuminant D65 should be used in all colorimetric calculations requiring representative outdoor daylight,
 * unless there are specific reasons for using a different spectral power distribution.
 *
 * It's the illuminant used in the RGB color space.
 *
 * @see https://cie.co.at/publications/colorimetry-part-2-cie-standard-illuminants-0
 */
export const IlluminantD65: Illuminant = {
  name: 'D65',
  xR: 0.9504559270516716,
  yR: 1.0,
  zR: 1.0890577507598784
};
