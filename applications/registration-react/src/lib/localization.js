import LocalizedStrings from 'react-localization';

import terms from '../l10n/nb.json';
import helptexts from '../l10n/helptexts.nb';

const localization = new LocalizedStrings({
  nb: { ...terms, helptexts }
});

export default localization;

export function configureLocalization(language) {
  localization.setLanguage(language);
  return localization;
}
