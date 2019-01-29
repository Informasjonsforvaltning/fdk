import _ from 'lodash';

/*

Flat list of publishers is expected in format: [{key:string, ...}]

Forest is an array, where trees are built based on the fact the key has orgPath format, where paret codes are prefixes with '/' as separator
example:

[{key: "/ANNET", count: 5}, {key: "/ANNET/910244132", count: 4}]

 */

export function keyPrefixForest(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  const getChildren = item =>
    list.filter(g => g.key.substring(0, g.key.lastIndexOf('/')) === item.key);

  list.forEach(item => {
    const children = getChildren(item);

    children.forEach(item => _.set(item, 'hasParent', true));

    _.set(item, 'children', children);
  });

  return list.filter(tree => !tree.hasParent);
}
