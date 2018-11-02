import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ConfiguredFormRelatedDatasets } from './configured-form-related-datasets';

const mapStateToProps = ({ form }, ownProps) => {
  const { apiItem } = ownProps;
  return {
    syncErrors: getFormSyncErrors('apiDatasetReferences')(form),
    initialValues: {
      datasetReferences: _.get(apiItem, 'datasetReferences', [])
    }
  };
};

export const ConnectedFormRelatedDatasets = connect(mapStateToProps)(
  ConfiguredFormRelatedDatasets
);
