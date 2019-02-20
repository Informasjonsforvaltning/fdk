import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import _ from 'lodash';
import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';

export const FormMeta = ({ helptextItems }) => (
  <form>
    <div className="form-group">
      <Helptext
        title={localization.schema.apiMeta.helptext.cost}
        helptextItems={_.get(helptextItems, 'Cost')}
      />
      <Field name="cost" component={InputField} />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.apiMeta.helptext.usageLimitation}
        helptextItems={_.get(helptextItems, 'Traffic_Limits')}
      />
      <Field name="usageLimitation" component={InputField} />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.apiMeta.helptext.performance}
        helptextItems={_.get(helptextItems, 'Performance')}
      />
      <Field name="performance" component={InputField} />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.apiMeta.helptext.availability}
        helptextItems={_.get(helptextItems, 'Availability')}
      />
      <Field name="availability" component={InputField} />
    </div>
  </form>
);

FormMeta.defaultProps = {
  helptextItems: null
};

FormMeta.propTypes = {
  helptextItems: PropTypes.object
};
