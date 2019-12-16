import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import localization from '../../../services/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/fields/field-input/field-input.component';
import InputFieldReadonly from '../../../components/fields/field-input-readonly/field-input-readonly.component';
import LinkReadonlyField from '../../../components/fields/field-link-readonly/field-link-readonly.component';

export const FormContactPoint = ({ isReadOnly }) => (
  <form>
    <div className="form-group">
      <Helptext
        title={localization.schema.contactPoint.helptext.organizationalUnit}
        term="ContactPoint_organizational-unit"
      />
      <Field
        name="contactPoint[0].organizationUnit"
        component={isReadOnly ? InputFieldReadonly : InputField}
        label={localization.schema.contactPoint.organizationUnitLabel}
        isOnlyOneSelectedLanguage
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.contactPoint.helptext.hasURL}
        term="ContactPoint_hasURL"
      />
      <Field
        name="contactPoint[0].hasURL"
        component={isReadOnly ? LinkReadonlyField : InputField}
        label={localization.schema.contactPoint.hasURLLabel}
        isOnlyOneSelectedLanguage
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.contactPoint.helptext.hasEmail}
        term="ContactPoint_hasEmail"
      />
      <Field
        name="contactPoint[0].email"
        component={isReadOnly ? InputFieldReadonly : InputField}
        label={localization.schema.contactPoint.emailLabel}
        isOnlyOneSelectedLanguage
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
          component={isReadOnly ? InputFieldReadonly : InputField}
          label={localization.schema.contactPoint.hasTelephoneLabel}
          isOnlyOneSelectedLanguage
        />
      </div>
    </div>
  </form>
);
FormContactPoint.propTypes = {
  isReadOnly: PropTypes.bool
};
FormContactPoint.defaultProps = {
  isReadOnly: false
};
