const qs = require('qs');
export function getText(langTextCode) {
  let queryObj = qs.parse(window.location.search.substr(1));
  let langCode = typeof queryObj.lang === 'object' ? queryObj.lang[0] : queryObj.lang || 'nb';  
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
