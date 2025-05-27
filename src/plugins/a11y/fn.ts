export { isContrastAPCACompliant, type APCAContentType } from './src/checks/apca';
export { isContrastWCAG21Compliant, type WCAG21ContentType } from './src/checks/wcag21';

export {
  getOptimalColorForContrastAPCA,
  getOptimalColorForContrastWCAG21
} from './src/utils/optimal-contrast';
