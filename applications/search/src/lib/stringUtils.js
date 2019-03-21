import _ from 'lodash';

export function removeValue(listAsString, value) {
  return _.without(listAsString.split(','), value).join(',') || undefined; // return undefined instead of empty
}

export function addValue(listAsString, value) {
  return (listAsString || '')
    .split(',')
    .concat(value)
    .filter(v => !!v)
    .join(',');
}

export function getFirstLineOfText(text) {
  if (!text) {
    return null;
  }
  const breakPattern = /(\n|<br|<\/p|<\/h)/;
  const match = breakPattern.exec(text);

  let firstLine = match ? text.substr(0, match.index) : text;

  if (firstLine.length > 250) {
    firstLine = firstLine.substr(0, 220);
    firstLine = firstLine.substr(0, firstLine.lastIndexOf(' '));
  }

  if (firstLine.length < text.length) {
    firstLine += ' ...';
  }
  return firstLine;
}
