import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import SelectField from '../../../components/fields/field-select/field-select.component';

const apiServiceTypeSortOrder = {
  Kundeforhold: 0,
  Kontoopplysninger: 1
};

export const FormApiServiceType = ({ apiServiceTypeItems }) => (
  <form>
    <div className="form-group">
      <Helptext title={localization.schema.apiServiceType.title} />
      <Field
        name="serviceType"
        component={SelectField}
        items={_.sortBy(
          apiServiceTypeItems,
          item => apiServiceTypeSortOrder[item.code]
        )}
        valueKey="code"
        saveObject={false}
      />
    </div>
  </form>
);

FormApiServiceType.defaultProps = {
  apiServiceTypeItems: []
};

FormApiServiceType.propTypes = {
  apiServiceTypeItems: PropTypes.array
};
