import axios from 'axios';
import _ from 'lodash';
import {
  apiFormPatchErrorAction,
  apiFormPatchIsSavingAction,
  apiFormPatchSuccessAction
} from '../../../redux/modules/api-form-status';
import { apiSuccessAction } from '../../../redux/modules/apis';
import { stringToNoolean } from '../../../lib/noolean';
import { normalizeAxiosError } from '../../../lib/normalize-axios-error';
import { apiPath } from '../../../api/api-registration-api';

const nooleanFields = [
  'isFree',
  'isOpenAccess',
  'isOpenLicense',
  'nationalComponent'
];
const convertToPatchValue = (value, field) =>
  _.includes(nooleanFields, field) ? stringToNoolean(value) : value;
const convertToPatchValues = formValues =>
  _.mapValues(formValues, convertToPatchValue);

export const asyncValidate = (values, dispatch, props) => {
  const {
    apiItem: { id: apiId, catalogId }
  } = props;

  if (!(catalogId && apiId)) {
    throw new Error('catalogId and apiId required');
  }
  dispatch(apiFormPatchIsSavingAction(apiId));

  const patch = convertToPatchValues(values);

  return axios
    .patch(apiPath(catalogId, apiId), patch)
    .then(response => {
      const apiRegistration = response && response.data;
      if (apiRegistration) {
        dispatch(apiFormPatchSuccessAction({ apiId, patch }));
        dispatch(apiSuccessAction(apiRegistration));
      }
    })
    .catch(error =>
      dispatch(apiFormPatchErrorAction(apiId, normalizeAxiosError(error)))
    );
};
