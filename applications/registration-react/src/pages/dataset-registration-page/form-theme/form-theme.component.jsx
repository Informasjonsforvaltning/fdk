import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import localization from '../../../utils/localization';
import Helptext from '../../../components/helptext/helptext.component';
import CheckboxFieldTheme from './theme-checkbox/theme-checkbox.component';

const FormThemes = props => {
  const {
    syncErrors: { errorTheme },
    helptextItems,
    initialValues
  } = props;
  const { theme, themesItems } = initialValues;
  if (theme && themesItems) {
    return (
      <form>
        <div className="form-group">
          <Helptext
            title={localization.schema.theme.helptext.theme}
            helptextItems={helptextItems.Dataset_theme}
          />
          <Field
            name="theme"
            component={CheckboxFieldTheme}
            themesItems={themesItems}
          />
          {errorTheme && (
            <div className="alert alert-danger mt-3">{errorTheme}</div>
          )}
        </div>
      </form>
    );
  }
  return null;
};

FormThemes.defaultProps = {
  initialValues: null,
  syncErrors: null
};

FormThemes.propTypes = {
  initialValues: PropTypes.object,
  syncErrors: PropTypes.object,
  helptextItems: PropTypes.object.isRequired
};

export default FormThemes;
