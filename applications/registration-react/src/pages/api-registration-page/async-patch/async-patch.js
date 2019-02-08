import axios from 'axios';
import _ from 'lodash';
import {
  apiFormPatchSuccessAction,
  apiFormPatchIsSavingAction,
  apiFormPatchErrorAction,
  apiFormPatchJustPublishedOrUnPublishedAction
} from '../../../redux/modules/api-form-status';
import { apiSuccessAction } from '../../../redux/modules/apis';

export const asyncValidate = (values, dispatch, props) => {
  const { match } = props;
  const apiId = _.get(match, ['params', 'id']);

  if (typeof dispatch !== 'function') {
    throw new Error('dispatch must be a function');
  }

  if (apiId) {
    dispatch(apiFormPatchIsSavingAction(apiId));
  }

  return axios
    .patch(_.get(match, 'url'), values)
    .then(response => {
      const apiRegistration = response && response.data;
      if (apiRegistration) {
        dispatch(
          apiFormPatchSuccessAction(
            apiRegistration.id,
            apiRegistration._lastModified
          )
        );
        if (_.get(values, 'registrationStatus')) {
          dispatch(
            apiFormPatchJustPublishedOrUnPublishedAction(
              apiRegistration.id,
              true,
              apiRegistration.registrationStatus
            )
          );
          dispatch(apiSuccessAction(apiRegistration));
        } else {
          dispatch(
            apiFormPatchJustPublishedOrUnPublishedAction(
              apiRegistration.id,
              false,
              apiRegistration.registrationStatus
            )
          );
        }
      }
    })
    .catch(response => {
      if (dispatch) {
        dispatch(
          apiFormPatchErrorAction(
            apiId,
            _.get(response, ['response', 'status'], 'network')
          )
        );
      }
      console.log(JSON.stringify(response)); // eslint-disable-line no-console
    });
};
