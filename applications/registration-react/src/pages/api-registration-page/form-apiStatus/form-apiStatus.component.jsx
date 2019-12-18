import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import SelectField from '../../../components/fields/field-select/field-select.component';
import DatepickerField from '../../../components/fields/field-datepicker/field-datepicker.component';
import TextAreaField from '../../../components/fields/field-textarea/field-textarea.component';
import InputField from '../../../components/fields/field-input/field-input.component';

const apiStatusSortOrder = {
  EXPERIMENTAL: 0,
  STABLE: 1,
  DEPRECATED: 2,
  REMOVED: 3
};

export const FormApiStatus = ({ apiStatusItems, apiStatusCodeFromForm }) => (
  <form>
    <div className="form-group">
      <Helptext title={localization.schema.apiStatus.helptext.apiStatus} />
      <Field
        name="statusCode"
        component={SelectField}
        items={_.sortBy(apiStatusItems, item => apiStatusSortOrder[item.code])}
        valueKey="code"
        saveObject={false}
      />

      {(apiStatusCodeFromForm === 'DEPRECATED' ||
        apiStatusCodeFromForm === 'REMOVED') && (
        <div className="mt-4">
          <div className="form-group">
            <Helptext
              title={
                localization.schema.apiStatus.helptext
                  .deprecationInfoExpirationDate
              }
            />
            <Field
              name="deprecationInfoExpirationDate"
              type="text"
              component={DatepickerField}
              label={
                localization.schema.apiStatus.helptext
                  .deprecationInfoExpirationDate
              }
            />
          </div>
          <div className="form-group">
            <Helptext
              title={
                localization.schema.apiStatus.helptext.deprecationInfoMessage
              }
            />
            <Field
              name="deprecationInfoMessage"
              component={TextAreaField}
              label={
                localization.schema.apiStatus.helptext.deprecationInfoMessage
              }
            />
          </div>
          <div className="form-group">
            <Helptext
              title={
                localization.schema.apiStatus.helptext
                  .deprecationInfoReplacedWithUrl
              }
            />
            <Field
              name="deprecationInfoReplacedWithUrl"
              component={InputField}
              label={
                localization.schema.apiStatus.helptext
                  .deprecationInfoReplacedWithUrl
              }
            />
          </div>
        </div>
      )}
    </div>
  </form>
);

FormApiStatus.defaultProps = {
  apiStatusItems: null,
  apiStatusCodeFromForm: null
};

FormApiStatus.propTypes = {
  apiStatusItems: PropTypes.array,
  apiStatusCodeFromForm: PropTypes.string
};
