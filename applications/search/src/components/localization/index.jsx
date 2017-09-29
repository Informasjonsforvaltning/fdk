import LocalizedStrings from 'react-localization';

import en from '../../l10n/en.json';
import nb from '../../l10n/nb.json';

let localization =  new LocalizedStrings({
  en, nb
});

localization.setLanguage('nb');

export default localization;