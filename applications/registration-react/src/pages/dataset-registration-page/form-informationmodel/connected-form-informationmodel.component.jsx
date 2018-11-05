import { connect } from 'react-redux';
import { getFormSyncErrors } from 'redux-form';
import _ from 'lodash';

import { ConfiguredFormInformationModel } from './configured-form-informationmodel';
import { informationModelType } from '../../../schemaTypes';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      informationModel:
        _.get(datasetItem, 'informationModel', []).length > 0
          ? _.get(datasetItem, 'informationModel')
          : [informationModelType]
    },
    syncErrors: getFormSyncErrors('informationModel')(state)
  };
};

export const ConnectedFormInformationModel = connect(mapStateToProps)(
  ConfiguredFormInformationModel
);
