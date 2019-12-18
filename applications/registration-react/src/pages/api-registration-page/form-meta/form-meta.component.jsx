import React from 'react';
import { Field } from 'redux-form';
import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import InputField from '../../../components/fields/field-input/field-input.component';

export const FormMeta = () => (
  <form>
    <div className="form-group">
      <Helptext title={localization.schema.apiMeta.helptext.cost} term="Cost" />
      <Field name="cost" component={InputField} />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.apiMeta.helptext.usageLimitation}
        term="Traffic_Limits"
      />
      <Field name="usageLimitation" component={InputField} />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.apiMeta.helptext.performance}
        term="Performance"
      />
      <Field name="performance" component={InputField} />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.apiMeta.helptext.availability}
        term="Availability"
      />
      <Field name="availability" component={InputField} />
    </div>
  </form>
);
