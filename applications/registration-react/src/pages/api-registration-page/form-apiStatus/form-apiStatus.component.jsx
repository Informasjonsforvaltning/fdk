import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import localization from '../../../utils/localization';
import Helptext from '../../../components/helptext/helptext.component';
import SelectField from '../../../components/field-select/field-select.component';

export const FormApiStatus = ({ apiStatusItems }) => (
  <form>
    <div className="form-group">
      <Helptext title={localization.schema.apiStatus.helptext.apiStatus} />
      <Field
        name="statusCode"
        component={SelectField}
        items={apiStatusItems}
        valueKey="code"
        saveObject={false}
      />
    </div>
  </form>
);

FormApiStatus.defaultProps = {
  apiStatusItems: null
};

FormApiStatus.propTypes = {
  apiStatusItems: PropTypes.array
};
