import { getFormSyncErrors, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import {
  multilingualObjectToMultilingualTagsArray,
  multilingualTagsArrayToMultilingualObject
} from '../../../lib/multilingual-tags-converter';
import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

import validate from './form-concept-validations';
import { FormConceptPure } from './form-concept-pure.component';

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

const formConfig = {
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

const enhance = compose(connect(mapStateToProps), reduxForm(formConfig));
export const FormConcept = enhance(FormConceptPure);
