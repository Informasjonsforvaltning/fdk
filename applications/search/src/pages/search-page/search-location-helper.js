/*

 Helper for manipulating location and history state
 Common for all search pages

  search page address search part has following paramters:
  q - search text
  page - page number (0-based)
  size - page size (default 10)
  sortfield - the only supported value is "modified", missing value is interpreted as "by relevance"
  [string] - all other params are filters

  in order to ensure url interoperability, the same paramters must be be supprtted by corresponding json-api endpoint

 */
import _ from 'lodash';

import {
  historyPushSearchParams,
  parseSearchParams,
  renderSearchParams
} from '../../lib/location-history-helper';
import { addValue, removeValue } from '../../lib/stringUtils';

export const getLinkForTab = (location, pathname) => {
  const oldSearchParams = parseSearchParams(location);
  // keep q
  // reset page, size, sortfield and filters

  const searchParams = _.pick(oldSearchParams, ['q']);
  const search = renderSearchParams(searchParams);
  return { pathname, search };
};

export const setSearchText = (history, location, searchText) => {
  const oldSearchParams = parseSearchParams(location);

  // set q
  // reset page
  // keep size, sortfield and filters

  const searchParams = {
    ...oldSearchParams,
    q: searchText || null,
    page: null
  };

  historyPushSearchParams(history, searchParams);
};

export const clearFilters = (history, location) => {
  const oldSearchParams = parseSearchParams(location);

  // reset page and filters
  // keep q, size, sortfield

  const searchParams = _.pick(oldSearchParams, ['q', 'size', 'sortfield']);
  historyPushSearchParams(history, searchParams);
};

export const isFilterNotEmpty = location =>
  _.some(
    _.values(_.omit(parseSearchParams(location), ['q', 'page', 'sortfield']))
  );

export const setFilter = (history, location, filter) => {
  const oldSearchParams = parseSearchParams(location);

  // shallow merge filters
  // reset page
  // keep size, sortfield and q

  const searchParams = { ...oldSearchParams, ...filter, page: null };
  historyPushSearchParams(history, searchParams);
};

export const setMultiselectFilterValue = (
  history,
  location,
  filterName,
  value,
  add
) => {
  const oldSearchParams = parseSearchParams(location);
  const oldFilterValue = oldSearchParams[filterName];
  const newFilterValue = add
    ? addValue(oldFilterValue, value)
    : removeValue(oldFilterValue, value);
  setFilter(history, location, { [filterName]: newFilterValue });
};

export const getSortfield = location => parseSearchParams(location).sortfield;

export const setSortfield = (history, location, sortfield) => {
  const oldSearchParams = parseSearchParams(location);

  // update sortfield
  // reset page
  // keep size, filters and q

  const searchParams = { ...oldSearchParams, sortfield, page: null };

  historyPushSearchParams(history, searchParams);
};

export const setPage = (history, location, page) => {
  const oldSearchParams = parseSearchParams(location);

  // set page
  // keep sortfield, size, filters and q

  const searchParams = { ...oldSearchParams, page };

  historyPushSearchParams(history, searchParams);
};

// todo type change
// reset all - page, sortfield, size, filters
// keep q
