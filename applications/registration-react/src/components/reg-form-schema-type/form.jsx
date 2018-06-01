import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import CheckBoxFieldType from '../reg-form-field-checkbox-type';

const FormType = props => {
  const {
    syncErrors: { errorType },
    helptextItems
  } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.type.helptext.type}
          helptextItems={helptextItems.Dataset_type}
        />
        <Field name="type" component={CheckBoxFieldType} />
        {errorType && (
          <div className="alert alert-danger mt-3">{errorType}</div>
        )}
      </div>
    </form>
  );
};

FormType.defaultProps = {
  syncErrors: null
};

FormType.propTypes = {
  syncErrors: PropTypes.object,
  helptextItems: PropTypes.object.isRequired
};

export default FormType;
