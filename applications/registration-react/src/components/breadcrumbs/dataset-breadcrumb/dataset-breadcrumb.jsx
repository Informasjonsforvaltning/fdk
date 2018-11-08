import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getDatasetItemByDatasetiId } from '../../../redux/modules/datasets';
import getTranslateText from '../../../utils/translateText';

export const PuredatasetBreadcrumb = props => {
  const { datasetItem } = props;
  return <span>{getTranslateText(_.get(datasetItem, 'title'))}</span>;
};

const mapStateToProps = ({ datasets }, ownProps) => {
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  const id = _.get(ownProps, ['match', 'params', 'id']);

  const datasetItem = getDatasetItemByDatasetiId(datasets, catalogId, id) || {
    datasetItem: null
  };

  return {
    datasetItem
  };
};

PuredatasetBreadcrumb.defaultProps = {
  datasetItem: null
};

PuredatasetBreadcrumb.propTypes = {
  datasetItem: PropTypes.object
};

export const DatasetBreadcrumb = connect(mapStateToProps)(
  PuredatasetBreadcrumb
);
