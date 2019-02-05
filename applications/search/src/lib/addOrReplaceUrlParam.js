import qs from 'qs';

/**
 * Returns param from url, if exists.
 * @returns {null}
 */
export function getParamFromUrl(param) {
  const queryObj = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  });
  if (queryObj && queryObj[param]) {
    return queryObj[param];
  }
  return null;
}

export function getParamFromLocation(location, param) {
  const queryObj = qs.parse(location && location.search, {
    ignoreQueryPrefix: true
  });

  return queryObj && queryObj[param];
}
