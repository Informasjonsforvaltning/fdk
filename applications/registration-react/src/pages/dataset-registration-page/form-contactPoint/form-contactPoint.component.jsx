import React from 'react';
import { Field } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';

export const FormContactPoint = () => (
  <form>
    <div className="form-group">
      <Helptext
        title={localization.schema.contactPoint.helptext.organizationalUnit}
        term="ContactPoint_organizational-unit"
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
        term="ContactPoint_hasURL"
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
        term="ContactPoint_hasEmail"
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
        term="ContactPoint_hasTelephone"
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
