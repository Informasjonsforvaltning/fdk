import _ from 'lodash';
import {
  apiFormPatchErrorAction,
  apiFormPatchIsSavingAction,
  apiFormPatchSuccessAction
} from '../../../redux/modules/api-form-status';
import { apiSuccessAction } from '../../../redux/modules/apis';
import { stringToNoolean } from '../../../lib/noolean';
import { patchApi } from '../../../api/api-registration-api';

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

export const apiFormPatchThunk = ({ catalogId, apiId, patch }) => dispatch => {
  if (!(catalogId && apiId)) {
    throw new Error('catalogId and apiId required');
  }

  dispatch(apiFormPatchIsSavingAction(apiId));

  return patchApi(catalogId, apiId, patch)
    .then(apiRegistration => {
      dispatch(apiFormPatchSuccessAction({ apiId, patch }));
      dispatch(apiSuccessAction(apiRegistration));
    })
    .catch(error => dispatch(apiFormPatchErrorAction(apiId, error)));
};

export const asyncValidate = (values, dispatch, props) => {
  const {
    apiItem: { id: apiId, catalogId }
  } = props;
  const patch = convertToPatchValues(values);
  return dispatch(apiFormPatchThunk({ catalogId, apiId, patch })).catch(
    console.error
  ); // handle rejects because form validation api expects certain format of rejects};
};
