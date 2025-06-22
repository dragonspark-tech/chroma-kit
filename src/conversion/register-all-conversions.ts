/**
 * This module registers all available color space conversions in the system.
 * It imports conversion functions from various color model modules and registers them
 * with the conversion system, enabling automatic path finding between color spaces.
 *
 * The registered conversions form a graph where:
 * - Nodes are color spaces (rgb, xyz, lab, etc.)
 * - Edges are direct conversion functions between spaces
 *
 * This graph structure allows the conversion system to find paths between any two
 * color spaces, even when direct conversions aren't available.
 */

import { registerConversion, buildConversionGraph } from './conversion';
import { rgbToHSL, rgbToHSV, rgbToHWB, rgbToXYZ } from '../models/rgb';
import {
  xyzToJzAzBz,
  xyzToJzCzHz,
  xyzToLab,
  xyzToLCh,
  xyzToOKLab,
  xyzToOKLCh,
  xyzToP3,
  xyzToRGB
} from '../models/xyz';
import { labToLCH, labToXYZ } from '../models/lab';
import { oklabToOKLCh, oklabToXYZ } from '../models/oklab';
import { oklchToOKLab } from '../models/oklch';
import { jzazbzToJzCzHz, jzazbzToXYZ } from '../models/jzazbz';
import { jzczhzToJzAzBz } from '../models/jzczhz';
import { lchToLab } from '../models/lch';
import { hslToHSV, hslToRGB } from '../models/hsl';
import { hsvToHSL, hsvToHWB, hsvToRGB } from '../models/hsv';
import { hwbToRGB } from '../models/hwb';
import { p3ToXYZ } from '../models/p3/p3';

/**
 * Registers all available color space conversion functions with the conversion system.
 * This function organizes registrations by source color space for better maintainability.
 *
 * The registered conversions include:
 * - RGB-based conversions (RGB to HSL, HSV, XYZ)
 * - HSL and HSV conversions
 * - XYZ-based conversions (to various color spaces like Lab, LCh, OKLab)
 * - Lab and LCh conversions
 * - OKLab and OKLCh conversions
 * - JzAzBz and JzCzHz conversions
 */
export function registerAllConversions(): void {
  // RGB color space conversions
  registerConversion('rgb', 'xyz', rgbToXYZ);
  registerConversion('rgb', 'hsl', rgbToHSL);
  registerConversion('rgb', 'hsv', rgbToHSV);
  registerConversion('rgb', 'hwb', rgbToHWB);

  // DCI-P3 color space conversions
  registerConversion('p3', 'xyz', p3ToXYZ);

  // HSL color space conversions
  registerConversion('hsl', 'rgb', hslToRGB);
  registerConversion('hsl', 'hsv', hslToHSV);

  // HSV color space conversions
  registerConversion('hsv', 'rgb', hsvToRGB);
  registerConversion('hsv', 'hsl', hsvToHSL);
  registerConversion('hsv', 'hwb', hsvToHWB);

  // HWB color space conversions
  registerConversion('hwb', 'rgb', hwbToRGB);

  // XYZ color space conversions (central hub for many conversions)
  registerConversion('xyz', 'rgb', xyzToRGB);
  registerConversion('xyz', 'p3', xyzToP3);
  registerConversion('xyz', 'lab', xyzToLab);
  registerConversion('xyz', 'lch', xyzToLCh);
  registerConversion('xyz', 'oklab', xyzToOKLab);
  registerConversion('xyz', 'oklch', xyzToOKLCh);
  registerConversion('xyz', 'jzazbz', xyzToJzAzBz);
  registerConversion('xyz', 'jzczhz', xyzToJzCzHz);

  // Lab color space conversions
  registerConversion('lab', 'xyz', labToXYZ);
  registerConversion('lab', 'lch', labToLCH);

  // LCh color space conversions
  registerConversion('lch', 'lab', lchToLab);

  // OKLab color space conversions
  registerConversion('oklab', 'xyz', oklabToXYZ);
  registerConversion('oklab', 'oklch', oklabToOKLCh);

  // OKLCh color space conversions
  registerConversion('oklch', 'oklab', oklchToOKLab);

  // JzAzBz color space conversions
  registerConversion('jzazbz', 'xyz', jzazbzToXYZ);
  registerConversion('jzazbz', 'jzczhz', jzazbzToJzCzHz);

  // JzCzHz color space conversions
  registerConversion('jzczhz', 'jzazbz', jzczhzToJzAzBz);

  // Build the conversion graph after registering all conversions
  buildConversionGraph();
}

registerAllConversions();
