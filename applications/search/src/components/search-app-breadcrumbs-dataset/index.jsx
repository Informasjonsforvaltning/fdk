import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTranslateText } from '../../utils/translateText';
import localization from '../localization';

export const PureDatasetBreadcrumb = props => {
  const { datasetItem } = props;
  let title;
  if (datasetItem && datasetItem.title) {
    title = getTranslateText(datasetItem.title, localization.getLanguage());
  }
  return <span>{title}</span>;
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

export default connect(mapStateToProps)(PureDatasetBreadcrumb);
