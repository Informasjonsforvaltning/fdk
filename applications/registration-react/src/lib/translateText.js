import localization from './localization';

export default function getTranslateText(
  textObj,
  selectedLanguage = localization.getLanguage()
) {
  if (!textObj || typeof textObj !== 'object') {
    return textObj;
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
