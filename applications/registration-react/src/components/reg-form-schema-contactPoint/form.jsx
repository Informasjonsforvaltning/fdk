import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';

export const FormContactPoint = props => {
  const { helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.contactPoint.helptext.organizationalUnit}
          helptextItems={helptextItems['ContactPoint_organizational-unit']}
        />
        <Field
          name="contactPoint[0].organizationUnit"
          component={InputField}
          label={localization.schema.contactPoint.organizationUnitLabel}
        />
      </div>
      <div className="form-group">
        <Helptext
          title={localization.schema.contactPoint.helptext.hasURL}
          helptextItems={helptextItems.ContactPoint_hasURL}
        />
        <Field
          name="contactPoint[0].hasURL"
          component={InputField}
          label={localization.schema.contactPoint.hasURLLabel}
        />
      </div>
      <div className="form-group">
        <Helptext
          title={localization.schema.contactPoint.helptext.hasEmail}
          helptextItems={helptextItems.ContactPoint_hasEmail}
        />
        <Field
          name="contactPoint[0].email"
          component={InputField}
          label={localization.schema.contactPoint.emailLabel}
        />
      </div>
      <div className="form-group">
        <Helptext
          title={localization.schema.contactPoint.helptext.hasTelephone}
          helptextItems={helptextItems.ContactPoint_hasTelephone}
        />
        <div className="w-50">
          <Field
            name="contactPoint[0].hasTelephone"
            component={InputField}
            label={localization.schema.contactPoint.hasTelephoneLabel}
          />
        </div>
      </div>
    </form>
  );
};

FormContactPoint.propTypes = {
  helptextItems: PropTypes.object.isRequired
};

export default FormContactPoint;
