import localization from './localization';

export function getTranslateText(textObj, language) {
  const selectedLanguage = language || localization.getLanguage();

  if (textObj === null || typeof textObj !== 'object') {
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
