import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import { ConfiguredFormLOS } from './configured-form-los';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem, losItems } = ownProps;
  return {
    initialValues: {
      theme: datasetItem.theme || []
    },
    losItems,
    syncErrors: getFormSyncErrors('los')(state)
  };
};

export const ConnectedFormLOS = connect(mapStateToProps)(ConfiguredFormLOS);
