import { connect } from 'react-redux';

import { ConfiguredFormSample } from './configured-form-sample';
import { textType, licenseType } from '../../../schemaTypes';

export const sampleTypes = values => {
  let samples = null;

  if (values && values.length > 0) {
    samples = values.map(item => ({
      id: item.id ? item.id : '',
      description: item.description ? item.description : textType,
      accessURL: item.accessURL ? item.accessURL : [],
      license: item.license ? item.license : licenseType,
      conformsTo: item.conformsTo ? item.conformsTo : [],
      page: item.page && item.page.length > 0 ? item.page : [{}],
      format: item.format ? item.format : [],
      type: item.type ? item.type : ''
    }));
  } else {
    samples = [];
  }
  return samples;
};

const mapStateToProps = (state, ownProps) => {
  const { datasetItem, openLicenseItems } = ownProps;
  return {
    initialValues: {
      sample: sampleTypes(datasetItem.sample) || [{}],
      openLicenseItems
    }
  };
};

export const ConnectedFormSample = connect(mapStateToProps)(
  ConfiguredFormSample
);
