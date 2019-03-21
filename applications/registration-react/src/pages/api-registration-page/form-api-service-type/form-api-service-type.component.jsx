import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import SelectField from '../../../components/field-select/field-select.component';
<<<<<<< HEAD

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
=======
import DatepickerField from '../../../components/field-datepicker/field-datepicker.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';
import InputField from '../../../components/field-input/field-input.component';

const apiServiceTypeSortOrder = {
  EXPERIMENTAL: 0,
  STABLE: 1,
  DEPRECATED: 2,
  REMOVED: 3
};

export const FormApiServiceType = ({
  apiServiceTypeItems,
  apiServiceTypeCodeFromForm
}) => (
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

      {(apiServiceTypeCodeFromForm === 'DEPRECATED' ||
        apiServiceTypeCodeFromForm === 'REMOVED') && (
        <div className="mt-4">
          <div className="form-group">
            <Helptext
              title={
                localization.schema.apiServiceType.helptext
                  .deprecationInfoExpirationDate
              }
            />
            <Field
              name="deprecationInfoExpirationDate"
              type="text"
              component={DatepickerField}
              label={
                localization.schema.apiServiceType.helptext
                  .deprecationInfoExpirationDate
              }
            />
          </div>
          <div className="form-group">
            <Helptext
              title={
                localization.schema.apiServiceType.helptext
                  .deprecationInfoMessage
              }
            />
            <Field
              name="deprecationInfoMessage"
              component={TextAreaField}
              label={
                localization.schema.apiServiceType.helptext
                  .deprecationInfoMessage
              }
            />
          </div>
          <div className="form-group">
            <Helptext
              title={
                localization.schema.apiServiceType.helptext
                  .deprecationInfoReplacedWithUrl
              }
            />
            <Field
              name="deprecationInfoReplacedWithUrl"
              component={InputField}
              label={
                localization.schema.apiServiceType.helptext
                  .deprecationInfoReplacedWithUrl
              }
            />
          </div>
        </div>
      )}
>>>>>>> initial commit
    </div>
  </form>
);

FormApiServiceType.defaultProps = {
<<<<<<< HEAD
  apiServiceTypeItems: []
};

FormApiServiceType.propTypes = {
  apiServiceTypeItems: PropTypes.array
=======
  apiServiceTypeItems: null,
  apiServiceTypeCodeFromForm: null
};

FormApiServiceType.propTypes = {
  apiServiceTypeItems: PropTypes.array,
  apiServiceTypeCodeFromForm: PropTypes.string
>>>>>>> initial commit
};
