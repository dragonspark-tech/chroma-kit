import { isNone } from '../utils/logic';
import { type Color, colorVectorMappings } from '../foundation';

export const deltaE76 = (color: Color, sample: Color): number => {
  const { space } = color;

  const keys = colorVectorMappings[space];

  let sum = 0;
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    if (key === 'space' || key === 'alpha') continue;

    const c1 = color[key as keyof Color] as number;
    const c2 = sample[key as keyof Color] as number;

    if (isNone(c1) || isNone(c2)) continue;

    const diff = c2 - c1;
    sum += diff * diff;
  }

  return Math.sqrt(sum);
};
