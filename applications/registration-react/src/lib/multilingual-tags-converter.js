export const multilingualTagsArrayToMultilingualObject = tags =>
  tags.reduce((previous, current) => {
    const key = Object.keys(current)[0];
    const value = Object.values(current)[0];
    return { ...previous, [key]: (previous[key] || []).concat(value) };
  }, {});

export const multilingualObjectToMultilingualTagsArray = obj =>
  Object.entries(obj)
    .map(([key, value]) => value.map(tag => ({ [key]: tag })))
    .reduce((previous, current) => previous.concat(current), []);
