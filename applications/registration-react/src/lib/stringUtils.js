export function removeValue(list, value) {
  const modifiedList = list.split(',');
  modifiedList.splice(modifiedList.indexOf(value), 1);
  if (JSON.stringify(modifiedList) === '[]') {
    return undefined;
  }
  return modifiedList.join(',');
}

export function addValue(list, value) {
  let ret = [];
  if (list) {
    ret = list.split(',');
  }
  ret.push(value);
  return ret.join(',');
}
