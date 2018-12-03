import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import { ConfiguredFormPublish } from './configured-form-publish';

const mapStateToProps = ({ form }, ownProps) => {
  const { initialItemStatus } = ownProps;
  return {
    syncErrors: getFormSyncErrors('datasetPublish')(form),
    initialValues: {
      registrationStatus: initialItemStatus
    }
  };
};

export const ConnectedFormPublish = connect(mapStateToProps)(
  ConfiguredFormPublish
);
