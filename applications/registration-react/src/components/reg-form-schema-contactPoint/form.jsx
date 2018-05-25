import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';

export const FormContactPoint = props => {
  const { helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext
          title="Kontaktpunkt"
          helptextItems={helptextItems['ContactPoint_organizational-unit']}
        />
        <Field
          name="contactPoint[0].organizationUnit"
          component={InputField}
          label="Kontaktpunkt"
        />
      </div>
      <div className="form-group">
        <Helptext
          title="Kontaktskjema"
          helptextItems={helptextItems.ContactPoint_hasURL}
        />
        <Field
          name="contactPoint[0].hasURL"
          component={InputField}
          label="Kontaktskjema"
        />
      </div>
      <div className="form-group">
        <Helptext
          title="E-post"
          helptextItems={helptextItems.ContactPoint_hasEmail}
        />
        <Field
          name="contactPoint[0].email"
          component={InputField}
          label="E-post"
        />
      </div>
      <div className="form-group">
        <Helptext
          title="Telefon"
          helptextItems={helptextItems.ContactPoint_hasTelephone}
        />
        <div className="w-50">
          <Field
            name="contactPoint[0].hasTelephone"
            component={InputField}
            label="Telefon"
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
