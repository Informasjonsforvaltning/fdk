import LocalizedStrings from 'react-localization';
import config from '../config';

import nb from '../l10n/nb.json';

const localization = new LocalizedStrings({
  nb
});

localization.setLanguage(config.registrationLanguage);

export default localization;
