import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDataset } from '../../../api/datasets';
import { getTranslateText } from '../../../lib/translateText';

const memoizedGetDataset = _.memoize(getDataset);

export const PureDatasetBreadcrumb = props => {
  const { datasetItem } = props;
  return <span>{getTranslateText(datasetItem && datasetItem.title)}</span>;
};

const mapProps = {
  datasetItem: props => memoizedGetDataset(props.match.params.id)
};

PureDatasetBreadcrumb.defaultProps = {
  datasetItem: null
};

PureDatasetBreadcrumb.propTypes = {
  datasetItem: PropTypes.object
};

export const DatasetBreadcrumb = resolve(mapProps)(PureDatasetBreadcrumb);
