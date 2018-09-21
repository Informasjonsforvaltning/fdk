import { reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import Form from './form-concept.component';
import validate from './form-concept-validations';
import asyncValidate from '../../../utils/asyncValidate';

const FormConcept = reduxForm({
  form: 'concept',
  validate,
  asyncValidate
})(
  connect(state => ({
    syncErrors: getFormSyncErrors('concept')(state)
  }))(Form)
);

const mapStateToProps = ({ dataset }) => ({
  initialValues: {
    subject:
      dataset.result.subject && dataset.result.subject.length > 0
        ? dataset.result.subject
        : [],
    keyword:
      dataset.result.keyword && dataset.result.keyword.length > 0
        ? dataset.result.keyword
        : []
  }
});

export default connect(mapStateToProps)(FormConcept);
