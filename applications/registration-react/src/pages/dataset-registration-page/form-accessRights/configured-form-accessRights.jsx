import { reduxForm } from 'redux-form';
import _throttle from 'lodash/throttle';

import { FormAccessRights } from './form-accessRights.component';
import validate from './form-accessRights.validations';
import asyncValidate from '../../../lib/asyncValidate';

const config = {
  form: 'accessRights',
  validate,
  asyncValidate: _throttle(asyncValidate, 250)
};

export const ConfiguredFormAccessRights = reduxForm(config)(FormAccessRights);
