// in json, noolean (nullable boolean) is expressed as three values: true, false, null
// in our forms, we have assigned value "" to null

export function nooleanToString(nooleanValue) {
  switch (nooleanValue) {
    case true:
      return 'true';
    case false:
      return 'false';
    default:
      return '';
  }
}

export function stringToNoolean(stringValue) {
  switch (stringValue) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return null;
  }
}
