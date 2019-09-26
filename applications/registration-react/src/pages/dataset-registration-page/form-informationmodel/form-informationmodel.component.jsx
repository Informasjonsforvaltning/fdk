import { connect } from 'react-redux';
import { getFormSyncErrors, reduxForm } from 'redux-form';

import { asyncValidateDatasetInvokePatch } from '../formsLib/asyncValidateDatasetInvokePatch';

import { FormInformationModelPure } from './form-informationmodel-pure.component';
import { informationModelType } from '../../../schemaTypes';
import validate from './form-informationmodel-validations';

const mapStateToProps = (state, { datasetItem }) => {
  const { informationModel = [informationModelType] } = datasetItem;
  return {
    initialValues: {
      informationModel
    },
    errors: getFormSyncErrors('informationModel')(state)
  };
};

const formConfig = {
  form: 'informationModel',
  validate,
  asyncValidate: asyncValidateDatasetInvokePatch
};

export const FormInformationModel = connect(mapStateToProps)(
  reduxForm(formConfig)(FormInformationModelPure)
);
