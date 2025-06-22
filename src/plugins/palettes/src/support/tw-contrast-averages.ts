/**
 * Represents the average contrast values for a given shade with respect to white and black backgrounds.
 *
 * @property {number} shade - The shade value that serves as the base for contrast evaluation.
 * @property {number} onWhite - The calculated contrast value of the shade against a white background.
 * @property {number} onBlack - The calculated contrast value of the shade against a black background.
 */
export interface TwShadeContrastAverage {
  shade: number;
  onWhite: number;
  onBlack: number;
}

/**
 * Represents an array of objects that define average contrast values for various shades
 * of a color against white and black backgrounds.
 *
 * Each object in the array provides the following properties:
 * - `shade`: A numerical value representing the specific shade of the color.
 * - `onWhite`: The calculated average contrast of the color shade against a white background.
 * - `onBlack`: The calculated average contrast of the color shade against a black background.
 *
 * This data can be used to analyze or visualize the brightness and contrast progression
 * of a color palette or to determine accessibility compliance for text and backgrounds.
 *
 * Example values include:
 * - Lower `shade` values (e.g., 50, 100) with higher negative `onBlack` contrast values
 *   (indicating lower brightness against a black background).
 * - Higher `shade` values (e.g., 900, 950) with positive `onWhite` contrast values
 *   (indicating higher brightness against a white background).
 */
export const ShadeContrastAverages: TwShadeContrastAverage[] = [
  { shade: 50, onWhite: 0, onBlack: -102.86046980710087 },
  { shade: 100, onWhite: 4.565780844481383, onBlack: -97.17376606285426 },
  { shade: 200, onWhite: 15.878639752193317, onBlack: -87.83909945635801 },
  { shade: 300, onWhite: 28.577542420335547, onBlack: -74.34799728571537 },
  { shade: 400, onWhite: 42.58959885711072, onBlack: -59.71033687806202 },
  { shade: 500, onWhite: 53.270646321139445, onBlack: -48.70396941279779 },
  { shade: 600, onWhite: 65.35787926595782, onBlack: -36.37381755361905 },
  { shade: 700, onWhite: 77.04457702771663, onBlack: -24.733773791209327 },
  { shade: 800, onWhite: 85.94062198666708, onBlack: -16.12209997475914 },
  { shade: 900, onWhite: 91.71060075091228, onBlack: -10.276645942847008 },
  { shade: 950, onWhite: 101.21170948777784, onBlack: 0 }
];
