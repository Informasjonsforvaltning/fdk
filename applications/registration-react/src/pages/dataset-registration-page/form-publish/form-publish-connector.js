import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

const mapStateToProps = ({ form }) => ({
  syncErrors: getFormSyncErrors('datasetPublish')(form)
});

export const formPublishConnector = connect(mapStateToProps);
