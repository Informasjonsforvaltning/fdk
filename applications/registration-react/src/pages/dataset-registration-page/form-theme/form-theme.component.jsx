import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import _ from 'lodash';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import CheckboxFieldTheme from './theme-checkbox/theme-checkbox.component';
import { AlertMessage } from '../../../components/alert-message/alert-message.component';

export const FormThemes = props => {
  const { syncErrors, helptextItems, initialValues } = props;
  const { theme, themesItems } = initialValues;
  if (theme && themesItems) {
    return (
      <form>
        <div className="form-group">
          <Helptext
            title={localization.schema.theme.helptext.theme}
            helptextItems={helptextItems.Dataset_theme}
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
