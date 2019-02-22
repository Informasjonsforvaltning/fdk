import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import { ConfiguredFormAccess } from './configured-form-access';
import { nooleanToString } from '../../../lib/noolean';

const mapStateToProps = ({ form }, ownProps) => {
  const apiItem = (ownProps && ownProps.apiItem) || {};
  return {
    syncErrors: getFormSyncErrors('apiAccess')(form),
    initialValues: {
      isOpenAccess: nooleanToString(apiItem.isOpenAccess),
      isOpenLicense: nooleanToString(apiItem.isOpenLicense),
      isFree: nooleanToString(apiItem.isFree),
      nationalComponent: nooleanToString(apiItem.nationalComponent)
    }
  };
};

export const ConnectedFormAccess = connect(mapStateToProps)(
  ConfiguredFormAccess
);
