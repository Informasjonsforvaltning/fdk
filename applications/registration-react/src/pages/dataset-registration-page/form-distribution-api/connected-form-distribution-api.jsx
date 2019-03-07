import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormDistributionAPI } from './configured-form-distribution-api';
import { textType, licenseType } from '../../../schemaTypes';

export const distributionTypes = values => {
  let distributions = null;
  if (values && values.length > 0) {
    distributions = values.map(item => ({
      id: item.id ? item.id : '',
      description: item.description ? item.description : textType,
      accessURL: item.accessURL ? item.accessURL : [],
      license: item.license ? item.license : licenseType,
      conformsTo: item.conformsTo ? item.conformsTo : [],
      page: item.page && item.page.length > 0 ? item.page : [licenseType],
      format: item.format ? item.format : [],
      type: item.type ? item.type : '',
      accessService: item.accessService ? item.accessService : null
    }));
  } else {
    distributions = [];
  }
  return distributions;
};

const mapStateToProps = (state, ownProps) => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      distribution: distributionTypes(_.get(datasetItem, 'distribution'))
    }
  };
};

export const ConnectedFormDistributionAPI = connect(mapStateToProps)(
  ConfiguredFormDistributionAPI
);
