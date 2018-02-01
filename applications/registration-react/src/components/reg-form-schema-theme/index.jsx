import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import CheckboxFieldTheme from '../reg-form-field-theme-checkbox';
import asyncValidate from '../../utils/asyncValidate';
import { themeType } from '../../schemaTypes';

let FormThemes = props => {
  const { helptextItems, initialValues } = props;
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
        </div>
      </form>
    )
  } return null;
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
FormThemes = reduxForm({
  form: 'themes',
  asyncValidate,
})(FormThemes)

const mapStateToProps = ({ dataset, themes }) => (
  {
    initialValues: {
      themesItems: themes.themesItems,
      theme: dataset.result.theme || [themeType]
    }
  }
)

export default connect(mapStateToProps)(FormThemes)
