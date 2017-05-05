var pluralize = require('pluralize')
export function pluralizeObjectKeys (object:any) {
  for (var key in object) {
    if(Array.isArray(object[key])) {
      let keyInPlural = pluralize.plural(key);
      object[keyInPlural] = object[key];
      if(keyInPlural !== key) delete object[key];
    }
  }
  return object;
}
export function singularizeObjectKeys (object:any) {
  for (var key in object) {
    if(Array.isArray(object[key])) {
      let keyInPlural = pluralize.singular(key);
      object[keyInPlural] = object[key];
      if(keyInPlural !== key) delete object[key];
    }
  }
  return object;
}
