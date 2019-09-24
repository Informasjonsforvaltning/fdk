import { getFormSyncErrors, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { FormConceptPure } from './form-concept-pure';

import validate from './form-concept-validations';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

import {
  multilingualTagsArrayToMultilingualObject,
  multilingualObjectToMultilingualTagsArray
} from '../../../lib/multilingual-tags-converter';

const mapStateToProps = (state, { datasetItem }) => {
  const { concepts = [], keyword = [] } = datasetItem;
  return {
    initialValues: {
      concepts,
      keyword: multilingualTagsArrayToMultilingualObject(keyword)
    },
    errors: getFormSyncErrors('concept')(state)
  };
};

const reduxFormConfig = {
  form: 'concept',
  validate,
  asyncValidate: ({ keyword, ...values }, dispatch, props) =>
    Object.keys(validate({ keyword })).length
      ? Promise.resolve()
      : asyncValidateDatasetInvokePatch(
          {
            ...values,
            keyword: multilingualObjectToMultilingualTagsArray(keyword)
          },
          dispatch,
          props
        )
};

export const FormConcept = connect(mapStateToProps)(
  reduxForm(reduxFormConfig)(FormConceptPure)
);
