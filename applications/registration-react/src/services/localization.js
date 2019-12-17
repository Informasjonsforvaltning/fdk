import LocalizedStrings from 'react-localization';

import terms from '../l10n/nb.json';
import helptexts from '../l10n/helptexts.nb';
import { getConfig } from '../config';

const localization = new LocalizedStrings({
  nb: { ...terms, helptexts }
});

export default localization;

export function initLocalization() {
  localization.setLanguage(getConfig().registrationLanguage);
}
