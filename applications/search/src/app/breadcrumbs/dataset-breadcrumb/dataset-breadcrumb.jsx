import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTranslateText } from '../../../lib/translateText';

export const PureDatasetBreadcrumb = props => {
  const { datasetItem } = props;
  return <span>{getTranslateText(datasetItem && datasetItem.title)}</span>;
};

const mapStateToProps = ({ datasetDetails }) => {
  const { datasetItem } = datasetDetails || {
    datasetItem: null
  };
  return {
    datasetItem
  };
};

PureDatasetBreadcrumb.defaultProps = {
  datasetItem: null
};

PureDatasetBreadcrumb.propTypes = {
  datasetItem: PropTypes.object
};

export const DatasetBreadcrumb = connect(mapStateToProps)(
  PureDatasetBreadcrumb
);
