import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import _ from 'lodash';

import localization from '../../../services/localization';
import Helptext from '../../../components/helptext/helptext.component';
import CheckboxFieldTheme from './theme-checkbox/theme-checkbox.component';
import { AlertMessage } from '../../../components/alert-message/alert-message.component';
import { themesValues } from '../dataset-registration-page.logic';

export const FormThemes = props => {
  const { syncErrors, initialValues, isReadOnly, themes } = props;
  const { theme, themesItems } = initialValues;
  if (theme && themesItems) {
    if (!isReadOnly) {
      return (
        <form>
          <div className="form-group">
            <Helptext
              title={localization.schema.theme.helptext.theme}
              term="Dataset_theme"
            />
            <AlertMessage type="warning">
              <i className="fa fa-info-circle mr-2" />
              <span>{localization.schema.theme.deprecatedTheme}</span>
            </AlertMessage>
            <Field
              name="theme"
              component={CheckboxFieldTheme}
              themesItems={themesItems}
            />
            {_.get(syncErrors, 'errorTheme') && (
              <div className="alert alert-danger mt-3">
                {_.get(syncErrors, 'errorTheme')}
              </div>
            )}
          </div>
        </form>
      );
    }
    if (isReadOnly) {
      return (
        <>
          <Helptext
            title={localization.schema.theme.helptext.theme}
            term="Dataset_theme"
          />
          <div className="pl-3">{themesValues(themes.values)}</div>
        </>
      );
    }
  }
  return null;
};

FormThemes.defaultProps = {
  initialValues: null,
  syncErrors: null,
  isReadOnly: false,
  themes: null
};

FormThemes.propTypes = {
  initialValues: PropTypes.object,
  syncErrors: PropTypes.object,
  isReadOnly: PropTypes.bool,
  themes: PropTypes.object
};
