import { parse, deltaE } from './src';
import {  } from './src/fn';

const a = parse('#ffffff', 'oklab');
console.log(deltaE(a, '#000000', '2000').toFixed(2));
