/**
 * Add a URL parameter (or modify if already exists)
 * @param {textObj}   object  with translated texts
 * * @param {selectedLanguage}   preferred translate
 */
export function getTranslateText(textObj, selectedLanguage) {
  return (
    textObj[selectedLanguage]
    || textObj.nb
    || textObj.no
    || textObj.nn
    || textObj.en
    : null
  );
}
