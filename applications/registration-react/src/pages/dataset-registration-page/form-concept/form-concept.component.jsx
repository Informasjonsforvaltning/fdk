import { getFormSyncErrors, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'recompose';

import validate from './form-concept-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';
import { FormConceptPure } from './form-concept-pure.component';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      concepts:
        _.get(datasetItem, 'concepts', []).length > 0
          ? _.get(datasetItem, 'concepts')
          : [],
      keyword:
        _.get(datasetItem, 'keyword', []).length > 0
          ? _.get(datasetItem, 'keyword')
          : []
    },
    errors: getFormSyncErrors('concept')(state)
  };
};

const formConfig = {
  form: 'concept',
  validate,
  asyncValidate: asyncValidateDatasetInvokePatch
};

const enhance = compose(
  connect(mapStateToProps),
  reduxForm(formConfig)
);
export const FormConcept = enhance(FormConceptPure);
