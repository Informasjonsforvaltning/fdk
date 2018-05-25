import { reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import Form from './form';
import validate from './formValidations';
import asyncValidate from '../../utils/asyncValidate';
import { themeType } from '../../schemaTypes';

const FormThemes = reduxForm({
  form: 'themes',
  validate,
  asyncValidate
})(
  connect(state => ({
    syncErrors: getFormSyncErrors('themes')(state)
  }))(Form)
);

const mapStateToProps = ({ dataset, themes }) => ({
  initialValues: {
    theme: dataset.result.theme || [themeType],
    themesItems: themes.themesItems
  }
});

export default connect(mapStateToProps)(FormThemes);
