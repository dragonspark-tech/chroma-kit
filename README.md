<p align="center">
    <a href="#">
        <img alt="ChromaKit" src="./assets/gh_banner.png" width="100%" />
    </a>
</p>

<h1 align="center">
  ChromaKit
</h1>

<p align="center">
    <img alt="Static Badge" src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge">
    <img alt="npm" src="https://img.shields.io/npm/v/@dragonspark/chroma-kit.svg?labelColor=4B31C1&color=7E6CF2&style=for-the-badge" />
</p>

> <strong>ChromaKit</strong> is more than just a color library—it's a love letter to color science, crafted with precision and passion.

## The Chromatic Symphony

ChromaKit isn't just another color library. It's a meticulously crafted toolkit born from a deep appreciation for color science and a passion for precision. Every function, every algorithm, and every constant has been implemented with care, documented extensively, and tested rigorously.

## 🌟 Features

- 🚀 **Blazingly Fast**: Optimized for the absolute performance with minimal overhead.
- 📦 **Lightweight**: Designed for efficient integration, with an option functional API for even faster operations and smaller bundles.
- 🧠 **Advanced Color Science**: Implements modern color spaces and algorithms with scientific accuracy.
- 🔄 **Comprehensive Conversions**: Seamless transformations between all major color spaces.
- 📊 **Multiple Delta-E Algorithms**: Six different color difference calculation methods, each with its own perceptual strengths.
- 🎨 **Contrast Calculations**: Six different contrast algorithms including APCA and WCAG 2.1.
- 📚 **Educational**: Extensively documented with explanations of color theory concepts.
- 🛡️ **Type-Safe**: Written in TypeScript with complete type definitions.
- 🧩 **Modular Design**: Import only what you need.
- 💻 **Universal**: Works in browsers and Node.js environments.
- 🔍 **Precise**: High-precision color calculations for demanding applications.
- 🔬 **Scientifically Sound**: Implements algorithms according to official standards and research papers.

## Getting Started

```bash
npm install @dragonspark/chroma-kit
# or
yarn add @dragonspark/chroma-kit
# or
pnpm add @dragonspark/chroma-kit
```

```js
import { rgb, deltaE } from '@dragonspark/chroma-kit';

// Create colors
const red = rgb(1, 0, 0);
const blue = rgb(0, 0, 1);

// Convert between color spaces
const redInLab = red.to('lab');
const redInHsl = red.to('hsl');

// Calculate color difference
const difference = deltaE(red, blue, '2000'); // Using CIEDE2000 algorithm

// Convert to CSS string
console.log(red.toCSSString()); // "#ff0000"
```

## 🎨 Supported Color Models

ChromaKit embraces the full spectrum of color science with support for a comprehensive range of color models, from the familiar to the cutting-edge:

- **RGB**: The standard RGB color space (RGB) that powers digital displays
- **P3**: DCI-P3 color space with a wider gamut than sRGB for more vibrant colors on modern displays
- **HSL**: Hue, Saturation, Lightness - an intuitive cylindrical-coordinate representation
- **HSV**: Hue, Saturation, Value - another artist-friendly model for color selection
- **HWB**: Hue, Whiteness, Blackness - a human-friendly alternative to HSL/HSV
- **XYZ**: The foundational CIE XYZ color space that underpins modern colorimetry
- **Lab**: CIE L*a*b* - a perceptually uniform color space designed to approximate human vision
- **LCh**: Cylindrical representation of Lab with intuitive hue, chroma, and lightness components
- **OKLab**: Björn Ottosson's modern perceptually uniform color space with improved perceptual accuracy
- **OKLCh**: Cylindrical representation of OKLab combining perceptual uniformity with intuitive parameters
- **JzAzBz**: High dynamic range and perceptually uniform color space for HDR content
- **JzCzHz**: Cylindrical representation of JzAzBz for intuitive HDR color manipulation

Each color space is implemented with meticulous attention to the underlying mathematics and perceptual science, ensuring accurate conversions and calculations.

## 🧩 API

> You can browse our detailed API docs in [https://chromakit-docs.pages.dev/](https://chromakit-docs.pages.dev/)!

### Color Creation

```js
import { rgb, p3, hsl, lab } from '@dragonspark/chroma-kit';

// Create colors in different spaces
const redRGB = rgb(1, 0, 0);
const vividRedP3 = p3(1, 0, 0); // More vibrant red in the wider P3 gamut
const greenHSL = hsl(120, 1, 0.5);
const blueLab = lab(30, 20, -80);
```

### Color Parsing

ChromaKit provides a flexible system for parsing color strings. For better tree shaking and bundle size optimization, parsers are registered on demand:

```js
import { parseColor } from '@dragonspark/chroma-kit';
import {
  registerSRGBParser,
  registerHSLParser
} from '@dragonspark/chroma-kit/semantics/default-parsers';
import {
  registerAllParsers
} from '@dragonspark/chroma-kit/semantics/register-all-parsers';

// Register only the parsers you need
registerSRGBParser();
registerHSLParser();

// Or register all parsers at once
// registerAllParsers();

// Parse colors from strings
const red = parseColor('#ff0000', 'rgb');           // Hex colors work without registration
const blue = parseColor('rgb(0, 0, 255)', 'rgb');   // Requires RGB parser registration
const green = parseColor('hsl(120, 100%, 50%)', 'hsl'); // Requires HSL parser registration
```

### Color Conversion

```js
import { rgb, p3 } from '@dragonspark/chroma-kit';

const color = rgb(1, 0, 0);

// Convert to different color spaces
const hslColor = color.to('hsl');
const labColor = color.to('lab');
const lchColor = color.to('lch');
const p3Color = color.to('p3'); // Convert to wider gamut P3

// Convert from P3 to other spaces
const wideGamutColor = p3(1, 0.2, 0.1);
const srgbColor = wideGamutColor.to('rgb'); // May perform gamut mapping if needed
```

### Color Difference (Delta E)

The perception of color difference is a fascinating and complex area of color science. ChromaKit implements six different Delta E algorithms, each with its own strengths and applications:

```js
import { rgb, deltaE } from '@dragonspark/chroma-kit';

const burgundy = rgb(0.5, 0.1, 0.2);
const maroon = rgb(0.4, 0.1, 0.15);

// Calculate color difference using different algorithms
const diff1 = deltaE(burgundy, maroon, 'Euclidean'); // Classic Delta E76 - simple but less perceptually accurate
const diff2 = deltaE(burgundy, maroon, 'CMC');       // CMC l:c - textile industry standard with separate lightness/chroma factors
const diff3 = deltaE(burgundy, maroon, '2000');      // CIEDE2000 - the gold standard for color difference
const diff4 = deltaE(burgundy, maroon, 'OKLab');     // OKLab-based - modern approach with improved perceptual uniformity
const diff5 = deltaE(burgundy, maroon, 'ScaledOKLab'); // Scaled OKLab - adjusted for specific perceptual tasks
const diff6 = deltaE(burgundy, maroon, 'Jz');        // JzCzHz-based - optimized for HDR content

console.log(`Are these reds visually distinguishable? ${diff3 > 1 ? 'Yes' : 'Barely'}`);
```

Each algorithm has been implemented with careful attention to the original research papers and standards, ensuring accurate results for different applications from textile matching to display calibration.

### Contrast Calculation

Contrast is crucial for accessibility, readability, and visual design. ChromaKit offers six different contrast algorithms, each providing unique insights:

```js
import { rgb, contrast } from '@dragonspark/chroma-kit';

const navy = rgb(0.05, 0.05, 0.3);
const cream = rgb(0.98, 0.96, 0.86);

// Calculate contrast using different algorithms
const contrast1 = contrast(navy, cream, 'APCA');      // APCA - modern algorithm for text readability
const contrast2 = contrast(navy, cream, 'DeltaL*');   // Delta L* - simple lightness difference used in Material Design
const contrast3 = contrast(navy, cream, 'DeltaPhi*'); // Delta Phi* - extended model that includes chroma
const contrast4 = contrast(navy, cream, 'Michelson'); // Michelson - classic formula for optical contrast
const contrast5 = contrast(navy, cream, 'WCAG21');    // WCAG 2.1 - web accessibility standard
const contrast6 = contrast(navy, cream, 'Weber');     // Weber - psychophysical contrast formula

console.log(`WCAG 2.1 Compliance: ${contrast5 >= 4.5 ? 'AA' : contrast5 >= 3 ? 'AA Large' : 'Fail'}`);
console.log(`APCA Contrast: ${Math.abs(contrast1)}% - ${Math.abs(contrast1) >= 60 ? 'Good for body text' : 'Better for larger text'}`);
```

These algorithms allow you to evaluate contrast not just for accessibility compliance, but also for optimal readability and visual impact across different viewing conditions.

### Color Standards and Illuminants

ChromaKit implements precise color science standards including CIE standard illuminants:

```js
import { rgb } from '@dragonspark/chroma-kit';

// Convert a color to XYZ under different illuminants
const color = rgb(0.8, 0.4, 0.2);

// D65 (standard daylight) - default for RGB
const xyzD65 = color.to('xyz');

// D50 (horizon light) - common in printing
const xyzD50 = color.to('xyz', { useChromaticAdaptation: true });

// Compare appearance under different lighting conditions
console.log('Color appearance shifts under different lighting conditions');
```

The library includes precise implementations of standard illuminants like D65 (daylight), D50 (horizon light), and Illuminant A (tungsten), allowing for accurate color appearance modeling across different lighting conditions.

### String Serialization

```js
import { rgb, p3 } from '@dragonspark/chroma-kit';

const color = rgb(1, 0, 0);

// Convert to CSS string
console.log(color.toCSSString()); // "#ff0000"

// With alpha
const transparentColor = rgb(1, 0, 0, 0.5);
console.log(transparentColor.toCSSString()); // "rgba(255, 0, 0, 0.5)"

// P3 color serialization
const p3Color = p3(1, 0, 0);
console.log(p3Color.toCSSString()); // "color(display-p3 1.000 0.000 0.000)"

// P3 with alpha
const transparentP3 = p3(1, 0, 0, 0.5);
console.log(transparentP3.toCSSString()); // "color(display-p3 1.000 0.000 0.000 / 0.500)"
```

## 🚀 Advanced Features

ChromaKit goes beyond basic color manipulation to offer advanced features for professional applications:

### Chromatic Adaptation

Colors appear differently under different lighting conditions. ChromaKit implements precise chromatic adaptation algorithms to simulate how colors transform across different illuminants:

```js
import { rgb } from '@dragonspark/chroma-kit';

// A warm orange color under standard daylight (D65)
const orange = rgb(0.9, 0.6, 0.1);

// See how it would appear under warm indoor lighting (D50)
// using the Bradford cone response model
const orangeUnderIndoorLighting = orange.to('xyz', { 
  useChromaticAdaptation: true,
  // Optional parameters for advanced use cases
  // sourceIlluminant: IlluminantD65,
  // targetIlluminant: IlluminantD50,
  // coneResponseModel: BradfordConeModel
});

// Convert back to RGB for display
const adaptedColor = orangeUnderIndoorLighting.to('rgb');
console.log(`The color appears more ${adaptedColor.r > orange.r ? 'reddish' : 'yellowish'} indoors`);
```

### High Dynamic Range Support

As displays evolve to support higher brightness levels and wider color gamuts, ChromaKit is ready with support for HDR color spaces:

```js
import { rgb } from '@dragonspark/chroma-kit';

// A vibrant red in standard dynamic range
const sdrRed = rgb(1, 0, 0);

// Convert to JzAzBz for HDR processing with 1000 nits peak brightness
const hdrRed = sdrRed.to('jzazbz', { peakLuminance: 1000 });

// Convert to JzAzBz for HDR processing with 4000 nits peak brightness
const superHdrRed = sdrRed.to('jzazbz', { peakLuminance: 4000 });

// Compare perceptual lightness values
console.log('Perceptual lightness increases with display capability');
```

### Color Appearance Modeling

ChromaKit's perceptually uniform color spaces allow for sophisticated color appearance modeling:

```js
import { rgb, deltaE } from '@dragonspark/chroma-kit';

// Create a palette of colors
const baseColor = rgb(0.2, 0.4, 0.6);
const variations = [
  baseColor,
  rgb(0.22, 0.38, 0.58), // Subtle variation
  rgb(0.25, 0.45, 0.65), // More noticeable variation
  rgb(0.15, 0.35, 0.55)  // Darker variation
];

// Analyze perceptual differences in OKLab space
const differences = variations.map(color => 
  deltaE(baseColor, color, 'OKLab')
);

console.log('Perceptual differences from base color:', differences);
```

## 🔌 Plugins

ChromaKit includes several plugins that extend its functionality:

### Accessibility (a11y)

The accessibility plugin provides tools for ensuring your colors meet accessibility standards:

```js
import { rgb } from '@dragonspark/chroma-kit';
import { checkAPCAContrast, checkWCAG21Contrast, getOptimalColorForContrast } from '@dragonspark/chroma-kit/plugins/a11y';

// Check if colors meet accessibility standards
const text = rgb(0.1, 0.1, 0.1);
const background = rgb(0.95, 0.95, 0.95);

// Check APCA contrast
const apcaCompliant = checkAPCAContrast(text, background, 'BodyText');
console.log(`APCA compliant: ${apcaCompliant}`);

// Check WCAG 2.1 contrast
const wcagCompliant = checkWCAG21Contrast(text, background, 'AANormal');
console.log(`WCAG 2.1 compliant: ${wcagCompliant}`);

// Find an optimal color that meets contrast requirements
// Target contrast of 60 for APCA (good for body text)
const optimalColorAPCA = getOptimalColorForContrast(text, background, 60, 'APCA');

// Target contrast of 4.5 for WCAG 2.1 (AA normal text)
const optimalColorWCAG = getOptimalColorForContrast(text, background, 4.5, 'WCAG21');
```

Available content types for APCA: 'BodyText', 'LargeText', 'NonEssentialText', 'UIControls'  
Available content types for WCAG 2.1: 'AANormal', 'AALarge', 'AAANormal', 'AAALarge'

### Color Harmonies

The harmonies plugin provides tools for generating color harmonies:

```js
import { rgb } from '@dragonspark/chroma-kit';
import { harmony } from '@dragonspark/chroma-kit/plugins/harmonies';

const color = rgb(0.2, 0.4, 0.8);

// Generate complementary colors
const complementary = harmony(color, 'Complementary', 'rgb');

// Generate analogous colors
const analogous = harmony(color, 'Analogous', 'rgb');

// Generate triadic colors
const triadic = harmony(color, 'Triadic', 'rgb');

// Other available harmony types:
// - 'SplitComplementary'
// - 'DoubleSplitComplementary'
// - 'Square'
// - 'Tetradic'
// - 'Monochromatic'
```

### Color Palettes

The palettes plugin provides tools for generating color palettes:

```js
import { rgb } from '@dragonspark/chroma-kit';
import { generatePalette } from '@dragonspark/chroma-kit/plugins/palettes';

const baseColor = rgb(0.2, 0.4, 0.8);

// Generate a Tailwind palette
const tailwindPalette = generatePalette(baseColor, true, true, 'Tailwind v4');

// Generate a Radix UI palette
const radixPalette = generatePalette(baseColor, true, true, 'Radix UI');

// Parameters:
// - color: The base color to generate the palette from
// - adjustContrast: Whether to adjust contrast (default: true)
// - ensureColorInAdjustment: Whether to ensure the base color is included (default: true)
// - family: The palette family ('Tailwind v4' or 'Radix UI')
```

### Tailwind Colors

The tailwind plugin provides Tailwind CSS color utilities:

```js
import { TailwindColors } from '@dragonspark/chroma-kit/plugins/tailwind';

// Access Tailwind colors
const tailwindColors = TailwindColors;

// Access specific colors
const blue500 = tailwindColors.Blue[500];
```

## ✨ The ChromaKit Difference

What sets ChromaKit apart from other color libraries?

- **Scientific Rigor**: Every algorithm is implemented according to official standards and research papers, with meticulous attention to mathematical accuracy.
- **Educational Value**: Extensive documentation explains not just how to use the library, but the underlying color science concepts.
- **Comprehensive Approach**: From basic RGB manipulations to advanced HDR color spaces and perceptual models.
- **Developer Experience**: Intuitive API design with chainable methods and consistent patterns.
- **Future-Proof**: Support for cutting-edge color spaces like OKLab and JzAzBz that represent the future of digital color.

ChromaKit isn't just a tool—it's a companion for anyone working with color in the digital realm, whether you're a web developer, graphic designer, data visualization expert, or color scientist.

## ⚙️ Performance

ChromaKit is engineered for exceptional performance without compromising on accuracy or features. Every algorithm has been carefully optimized to minimize computational overhead while maintaining mathematical precision. The result is a library that outperforms many alternatives while providing more advanced features and greater accuracy.

Performance isn't just about speed—it's about reliability, consistency, and predictability. ChromaKit delivers on all fronts, making it suitable for both real-time applications and high-precision color science work.

## 🚩 Join the Chromatic Revolution

ChromaKit is more than just a library—it's an invitation to explore the fascinating world of color science. Whether you're building a design tool, creating data visualizations, developing a photo editing application, or simply want to understand color better, ChromaKit provides the tools and knowledge you need.

We've poured our passion for color into every line of code, every algorithm implementation, and every documentation comment. We hope that using ChromaKit brings you not just functional benefits, but also a deeper appreciation for the science and art of color.

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT license - see the [LICENSE](LICENSE.md) file for more details.

---

<div align="center">
  <em>Crafted with ❤️ and an obsession for color accuracy by the DragonSpark team.</em>
</div>
