import qs from 'qs';

import localization from './localization';

export function getTranslateText(
  textObj,
  selectedLanguage = localization.getLanguage()
) {
  if (!textObj) {
    return null;
  }
  return (
    textObj[selectedLanguage] ||
    textObj.nb ||
    textObj.no ||
    textObj.nn ||
    textObj.en ||
    null
  );
}

/**
 * Returns language code from url parameter "lang", if exists.
 * @returns {null}
 */
export function getLanguageFromUrl() {
  const queryObj = qs.parse(window.location.search.substr(1));
  if (queryObj && queryObj.lang) {
    return queryObj.lang;
  }
  return null;
}
