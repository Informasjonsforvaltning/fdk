import React from 'react';
import { connect } from 'react-redux';
import { getTranslateText } from '../../utils/translateText';
import localization from '../localization';

const PureDatasetBreadcrumb = ({ title }) => <span>{title}</span>;

const mapStateToProps = ({ datasetDetails }, props) => {
  const {
    datasetItem
  } = datasetDetails || {
    datasetItem: null
  };

  let title;
  if (datasetItem) {
    return {
      title: datasetItem.title ? getTranslateText(datasetItem.title, localization.getLanguage()) : null
    }
  } return {
    title: null
  }
};

export default connect(mapStateToProps)(PureDatasetBreadcrumb);
