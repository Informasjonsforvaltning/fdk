export function removeValue(list, value) {
  list = list.split(',');
  list.splice(list.indexOf(value), 1);
  if (JSON.stringify(list) === '[]') {
    return undefined;
  } return list.join(',');
}

export function addValue(list, value) {
  let ret = [];
  if (list) {
    ret = list.split(',');
  }
  ret.push(value);
  return ret.join(',');
}

