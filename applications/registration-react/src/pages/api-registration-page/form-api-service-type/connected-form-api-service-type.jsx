import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ConfiguredFormApiServiceType } from './configured-form-api-service-type';

const mapStateToProps = (state, ownProps) => {
  const { apiItem } = ownProps;
  return {
    syncErrors: getFormSyncErrors('apiServiceType')(state.form),
    initialValues: {
      serviceType: _.get(apiItem, 'serviceType')
    }
  };
};

export const ConnectedFormApiServiceType = connect(mapStateToProps)(
  ConfiguredFormApiServiceType
);
