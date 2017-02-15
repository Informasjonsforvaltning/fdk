const qs = require('qs');
export function getText(langTextCode) {
  let queryObj = qs.parse(window.location.search.substr(1));
  console.log('queryObj is ', queryObj);
  let langCode = queryObj.lang || 'nb';
  var langStrings = window.langStrings || {
    en: {
      'Datakatalog': 'data catalog'
    },
    nb: {
      'Datakatalog': 'Datakatalog'
    }
  }
  if(langStrings[langCode][langTextCode]) {
    return langStrings[langCode][langTextCode];
  } else {
      return langCode + ': ' + langTextCode;
  }
}
