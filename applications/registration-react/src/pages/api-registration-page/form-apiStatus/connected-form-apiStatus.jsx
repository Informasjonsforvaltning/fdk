import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ConfiguredFormApiStatus } from './configured-form-apiStatus';

const mapStateToProps = ({ form }, ownProps) => {
  const { apiItem } = ownProps;
  return {
    syncErrors: getFormSyncErrors('apiStatus')(form),
    initialValues: {
      status: _.get(apiItem, 'status')
    }
  };
};

export const ConnectedFormApiStatus = connect(mapStateToProps)(
  ConfiguredFormApiStatus
);
