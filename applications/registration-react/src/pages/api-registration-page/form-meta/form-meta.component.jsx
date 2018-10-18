import React from 'react';
import { Field } from 'redux-form';
import localization from '../../../utils/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';

export const FormMeta = () => (
  <form>
    <div className="form-group">
      <Helptext title={localization.schema.apiMeta.helptext.cost} />
      <Field name="cost" component={InputField} />
    </div>
    <div className="form-group">
      <Helptext title={localization.schema.apiMeta.helptext.usageLimitation} />
      <Field name="usageLimitation" component={InputField} />
    </div>
    <div className="form-group">
      <Helptext title={localization.schema.apiMeta.helptext.performance} />
      <Field name="performance" component={InputField} />
    </div>
    <div className="form-group">
      <Helptext title={localization.schema.apiMeta.helptext.availability} />
      <Field name="availability" component={InputField} />
    </div>
  </form>
);
