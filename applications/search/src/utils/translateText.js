import qs from 'qs';

/**
 * Add a URL parameter (or modify if already exists)
 * @param {textObj}   object  with translated texts
 * * @param {selectedLanguage}   preferred translate
 */
export function getTranslateText(textObj, selectedLanguage) {
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
