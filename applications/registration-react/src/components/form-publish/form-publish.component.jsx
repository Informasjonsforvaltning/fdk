import React from 'react';
import { Field } from 'redux-form';

import { ButtonRegistrationStatus } from './button-registration-status/button-registration-status.component';

export const FormPublish = () => (
  <form>
    <Field name="registrationStatus" component={ButtonRegistrationStatus} />
  </form>
);
