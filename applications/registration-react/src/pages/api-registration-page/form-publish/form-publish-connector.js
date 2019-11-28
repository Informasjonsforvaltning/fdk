import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

const mapStateToProps = ({ form }) => ({
  syncErrors: getFormSyncErrors('apiMetaPublish')(form)
});

export const formPublishConnector = connect(mapStateToProps);
