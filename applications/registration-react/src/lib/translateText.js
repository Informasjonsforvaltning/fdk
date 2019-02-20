import localization from './localization';

export default function getTranslateText(
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
