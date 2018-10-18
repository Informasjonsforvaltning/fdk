import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormPublish } from './configured-form-publish';

const mapStateToProps = ({ form }, ownProps) => {
  const { apiItem } = ownProps;
  return {
    syncErrors: getFormSyncErrors('apiMetaPublish')(form),
    initialValues: {
      registrationStatus: _.get(apiItem, 'registrationStatus', '')
    }
  };
};

export const ConnectedFormPublish = connect(mapStateToProps)(
  ConfiguredFormPublish
);
