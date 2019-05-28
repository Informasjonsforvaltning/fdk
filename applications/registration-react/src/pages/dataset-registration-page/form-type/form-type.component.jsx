import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import _ from 'lodash';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import CheckBoxFieldType from './field-checkbox-type/field-checkbox.component';

export const FormType = props => {
  const { syncErrors } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.type.helptext.type}
          term="Dataset_type"
        />
        <Field name="type" component={CheckBoxFieldType} />
        {_.get(syncErrors, 'errorType') && (
          <div className="alert alert-danger mt-3">
            {_.get(syncErrors, 'errorType')}
          </div>
        )}
      </div>
    </form>
  );
};

FormType.defaultProps = {
  syncErrors: null
};

FormType.propTypes = {
  syncErrors: PropTypes.object
};
