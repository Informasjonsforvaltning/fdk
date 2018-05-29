import { reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import Form from './form';
import validate from './formValidations';
import asyncValidate from '../../utils/asyncValidate';
import shouldAsyncValidate from '../../utils/shouldAsyncValidate';
import { textType, emptyArray } from '../../schemaTypes';

const FormTitle = reduxForm({
  form: 'title',
  validate,
  shouldAsyncValidate,
  asyncValidate,
  asyncChangeFields: []
})(
  connect(state => ({
    syncErrors: getFormSyncErrors('title')(state)
  }))(Form)
);

const mapStateToProps = ({ dataset }) => ({
  initialValues: {
    title:
      dataset.result.title &&
      dataset.result.title.nb &&
      dataset.result.title.nb.length > 0
        ? dataset.result.title
        : textType,
    description:
      dataset.result.description &&
      dataset.result.description.nb &&
      dataset.result.description.nb.length > 0
        ? dataset.result.description
        : textType,
    objective:
      dataset.result.objective &&
      dataset.result.objective.nb &&
      dataset.result.objective.nb.length > 0
        ? dataset.result.objective
        : textType,
    landingPage: dataset.result.landingPage || emptyArray
  }
});

export default connect(mapStateToProps)(FormTitle);
