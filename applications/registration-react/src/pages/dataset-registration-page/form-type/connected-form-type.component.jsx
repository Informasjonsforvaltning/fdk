import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormType } from './configured-form-type';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      type: _.get(datasetItem, 'type', '')
    },
    syncErrors: getFormSyncErrors('type')(state)
  };
};

export const ConnectedFormType = connect(mapStateToProps)(ConfiguredFormType);
