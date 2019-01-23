import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getApi } from '../../../api/apis';
import { getTranslateText } from '../../../lib/translateText';

const memoizedGetApi = _.memoize(getApi);

export const PureApiBreadcrumb = props => {
  const { apiItem } = props;
  return <span>{getTranslateText(apiItem && apiItem.title)}</span>;
};

const mapProps = {
  apiItem: props => memoizedGetApi(props.match.params.id)
};

PureApiBreadcrumb.defaultProps = {
  apiItem: null
};

PureApiBreadcrumb.propTypes = {
  apiItem: PropTypes.object
};

export const ApiBreadcrumb = resolve(mapProps)(PureApiBreadcrumb);
