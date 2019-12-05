import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import _ from 'lodash';

import localization from '../../../services/localization';
import Helptext from '../../../components/helptext/helptext.component';
import CheckBoxFieldType from './field-checkbox-type/field-checkbox.component';
import { typeValues } from '../dataset-registration-page.logic';

export const FormType = props => {
  const { syncErrors, isReadOnly, type } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.type.helptext.type}
          term="Dataset_type"
        />
        {!isReadOnly && <Field name="type" component={CheckBoxFieldType} />}
        {isReadOnly && <div className="pl-3">{typeValues(type.values)}</div>}
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
  syncErrors: null,
  type: null,
  isReadOnly: false
};

FormType.propTypes = {
  syncErrors: PropTypes.object,
  type: PropTypes.object,
  isReadOnly: PropTypes.bool
};
