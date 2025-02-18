import type { Matrix3x3 } from '../utils/linear';

export const BRADFORD_D50_TO_D65: Matrix3x3 = [
  [
    0.9555766462451653,
    -0.023039426634341033,
    0.06316369768772678
  ],
  [
    -0.02828954186718683,
    1.0099416772919367,
    0.021007612783786933
  ],
  [
    0.012298152535565432,
    -0.020483072365186192,
    1.3299098368145301
  ]
];

export const BRADFORD_D65_TO_D50: Matrix3x3 = [
  [
    1.0478112719598691,
    0.022886525214775758,
    -0.05012693920986061
  ],
  [
    0.029542405202826368,
    0.9904844613128458,
    -0.017049121601636838
  ],
  [
    -0.009234507223803406,
    0.015043570198253024,
    0.7521316440046968
  ]
];

export const coneMatrixes: {[key: string]: Matrix3x3} = {
  'BRADFORD_D50_TO_D65': BRADFORD_D50_TO_D65,
  'BRADFORD_D65_TO_D50': BRADFORD_D65_TO_D50
};