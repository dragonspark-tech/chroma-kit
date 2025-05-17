import { registerConversion } from './conversion';
import { rgbToHSL, rgbToHSV, rgbToXYZ } from '../models/rgb';
import {
  xyzToJzAzBz,
  xyzToJzCzHz,
  xyzToLab,
  xyzToLCh,
  xyzToOKLab,
  xyzToOKLCh,
  xyzToRGB
} from '../models/xyz';
import { labToLCH, labToXYZ } from '../models/lab';
import { oklabToOKLCh, oklabToXYZ } from '../models/oklab';
import { oklchToOKLab } from '../models/oklch';
import { jzazbzToJzCzHz, jzazbzToXYZ } from '../models/jzazbz';
import { jzczhzToJzAzBz } from '../models/jzczhz';
import { lchToLab } from '../models/lch';
import { hslToHSV, hslToRGB } from '../models/hsl';
import { hsvToHSL, hsvToRGB } from '../models/hsv';

// Register all conversions
export function registerAllConversions() {
  // RGB conversions
  registerConversion('rgb', 'xyz', rgbToXYZ);
  registerConversion('rgb', 'hsl', rgbToHSL);
  registerConversion('rgb', 'hsv', rgbToHSV);

  // HSL conversions
  registerConversion('hsl', 'rgb', hslToRGB);
  registerConversion('hsl', 'hsv', hslToHSV);

  // HSV conversions
  registerConversion('hsv', 'rgb', hsvToRGB);
  registerConversion('hsv', 'hsl', hsvToHSL);

  // XYZ conversions
  registerConversion('xyz', 'rgb', xyzToRGB);
  registerConversion('xyz', 'lab', xyzToLab);
  registerConversion('xyz', 'lch', xyzToLCh);
  registerConversion('xyz', 'oklab', xyzToOKLab);
  registerConversion('xyz', 'oklch', xyzToOKLCh);
  registerConversion('xyz', 'jzazbz', xyzToJzAzBz);
  registerConversion('xyz', 'jzczhz', xyzToJzCzHz);

  // Lab conversions
  registerConversion('lab', 'xyz', labToXYZ);
  registerConversion('lab', 'lch', labToLCH);

  // LCh conversions
  registerConversion('lch', 'lab', lchToLab);

  // OKLab conversions
  registerConversion('oklab', 'xyz', oklabToXYZ);
  registerConversion('oklab', 'oklch', oklabToOKLCh);

  // OKLCh conversions
  registerConversion('oklch', 'oklab', oklchToOKLab);

  // JzAzBz conversions
  registerConversion('jzazbz', 'xyz', jzazbzToXYZ);
  registerConversion('jzazbz', 'jzczhz', jzazbzToJzCzHz);

  // JzCzHz conversions
  registerConversion('jzczhz', 'jzazbz', jzczhzToJzAzBz);
}

// Register all conversions immediately
registerAllConversions();
