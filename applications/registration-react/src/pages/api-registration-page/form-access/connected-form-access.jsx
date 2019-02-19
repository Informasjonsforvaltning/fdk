import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormAccess } from './configured-form-access';

const mapStateToProps = ({ form }, ownProps) => {
  const { apiItem } = ownProps;
  return {
    syncErrors: getFormSyncErrors('apiAccess')(form),
    initialValues: {
      isOpenAccess: _.get(apiItem, 'isOpenAccess', '').toString(),
      isOpenLicense: _.get(apiItem, 'isOpenLicense', '').toString(),
      isFree: _.get(apiItem, 'isFree', '').toString(),
      nationalComponent: _.get(apiItem, 'nationalComponent', '').toString()
    }
  };
};

export const ConnectedFormAccess = connect(mapStateToProps)(
  ConfiguredFormAccess
);
