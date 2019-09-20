export const deepKeys = (obj, predicate) =>
  Object.keys(obj).reduce(
    (aggregate, key) =>
      aggregate.concat(
        predicate(key, obj[key]) ? key : [],
        obj[key] !== null && typeof obj[key] === 'object'
          ? deepKeys(obj[key], predicate)
          : []
      ),
    []
  );
