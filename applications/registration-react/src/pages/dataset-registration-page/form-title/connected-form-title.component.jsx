import { reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../../utils/localization';
import Form from './form-title.component';
import validate from './form-title.validations';
import asyncValidate from '../../../utils/asyncValidate';
import shouldAsyncValidate from '../../../utils/shouldAsyncValidate';
import { textType, emptyArray } from '../../../schemaTypes';

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
      dataset.result.title[localization.getLanguage()] &&
      dataset.result.title[localization.getLanguage()].length > 0
        ? dataset.result.title
        : textType,
    description:
      dataset.result.description &&
      dataset.result.description[localization.getLanguage()] &&
      dataset.result.description[localization.getLanguage()].length > 0
        ? dataset.result.description
        : textType,
    objective:
      dataset.result.objective &&
      dataset.result.objective[localization.getLanguage()] &&
      dataset.result.objective[localization.getLanguage()].length > 0
        ? dataset.result.objective
        : textType,
    landingPage: dataset.result.landingPage || emptyArray
  }
});

export default connect(mapStateToProps)(FormTitle);
