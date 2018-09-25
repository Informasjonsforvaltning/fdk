import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Form from './form-informationmodel.component';
import validate from './form-informationmodel-validations';
import asyncValidate from '../../../utils/asyncValidate';
import { informationModelType } from '../../../schemaTypes';

const FormInformationModel = reduxForm({
  form: 'informationModel',
  validate,
  asyncValidate,
  asyncChangeFields: []
})(Form);

const mapStateToProps = ({ dataset }) => ({
  initialValues: {
    informationModel:
      dataset.result.informationModel &&
      dataset.result.informationModel.length > 0
        ? dataset.result.informationModel
        : [informationModelType]
  }
});

export default connect(mapStateToProps)(FormInformationModel);
