import React from 'react';
import { Field, reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux'

import Helptext from '../reg-form-helptext';
import CheckboxFieldTheme from '../reg-form-field-theme-checkbox';
import asyncValidate from '../../utils/asyncValidate';
import { themeType } from '../../schemaTypes';
import { validateAtLeastRequired} from '../../validation/validation';

const validate = values => {
  let errors = {}
  const { theme } = values;
  errors = validateAtLeastRequired('errorTheme', theme, 1, errors, false);
  return errors
}

let FormThemes = props => {
  const { syncErrors: { errorTheme }, helptextItems, initialValues } = props;
  const { theme, themesItems } = initialValues;
  if (theme && themesItems) {
    return (
      <form>
        <div className="form-group">
          <Helptext title="Tema" helptextItems={helptextItems.Dataset_theme} />
          <Field
            name="theme"
            component={CheckboxFieldTheme}
            themesItems={themesItems}
          />
          {errorTheme &&
          <div className="alert alert-danger mt-3">{errorTheme}</div>
          }
        </div>
      </form>
    )
  } return null;
}

FormThemes = reduxForm({
  form: 'themes',
  validate,
  asyncValidate,
})(connect(state => {
  return {
    syncErrors: getFormSyncErrors("themes")(state)
  }
})(FormThemes));

const mapStateToProps = ({ dataset, themes }) => (
  {
    initialValues: {
      theme: dataset.result.theme || [themeType],
      themesItems: themes.themesItems
    }
  }
)

export default connect(mapStateToProps)(FormThemes)
