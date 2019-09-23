import { getFormSyncErrors, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'recompose';
import { FormRelatedDatasetsPure } from './form-related-datasets-pure';
import { asyncValidate } from '../async-patch/async-patch';

const mapStateToProps = ({ form }, ownProps) => {
  const { apiItem } = ownProps;
  return {
    syncErrors: getFormSyncErrors('apiDatasetReferences')(form),
    initialValues: {
      datasetUris: _.get(apiItem, 'datasetUris', [])
    }
  };
};

const enhance = compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'apiDatasetReferences',
    asyncValidate
  })
);

export const FormRelatedDatasets = enhance(FormRelatedDatasetsPure);
