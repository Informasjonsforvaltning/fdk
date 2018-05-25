export default function getTranslateText(textObj, selectedLanguage = 'nb') {
  return (
    textObj[selectedLanguage] ||
    textObj.nb ||
    textObj.no ||
    textObj.nn ||
    textObj.en ||
    null
  );
}
