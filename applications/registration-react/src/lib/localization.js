import LocalizedStrings from 'react-localization';

import nb from '../l10n/nb.json';

const localization = new LocalizedStrings({
  nb
});

export default localization;

export function configureLocalization(language) {
  localization.setLanguage(language);
  return localization;
}
