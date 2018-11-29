import axios from 'axios';
import _ from 'lodash';
import {
  apiFormPatchSuccessAction,
  apiFormPatchIsSavingAction,
  apiFormPatchErrorAction,
  apiFormPatchJustPublishedOrUnPublishedAction
} from '../../../redux/modules/api-form-status';
import { setApiItemStatusAction } from '../../../redux/modules/apis';

export const asyncValidate = (values, dispatch, props) => {
  const { match } = props;
  const catalogId = _.get(match, ['params', 'catalogId']);
  const apiId = _.get(match, ['params', 'id']);

  if (dispatch && apiId) {
    dispatch(apiFormPatchIsSavingAction(apiId));
  }

  return axios
    .patch(_.get(match, 'url'), values)
    .then(response => {
      if (dispatch) {
        dispatch(
          apiFormPatchSuccessAction(
            _.get(response, ['data', 'id']),
            _.get(response, ['data', '_lastModified'])
          )
        );
        if (_.get(values, 'registrationStatus')) {
          dispatch(
            apiFormPatchJustPublishedOrUnPublishedAction(
              _.get(response, ['data', 'id']),
              true,
              _.get(values, 'registrationStatus')
            )
          );
          dispatch(
            setApiItemStatusAction(
              catalogId,
              apiId,
              _.get(values, 'registrationStatus')
            )
          );
        } else {
          dispatch(
            apiFormPatchJustPublishedOrUnPublishedAction(
              _.get(response, ['data', 'id']),
              false,
              _.get(response, ['data', 'registrationStatus'])
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
            _.get(response, ['response', 'status'], 404)
          )
        );
      }
      console.log(JSON.stringify(response)); // eslint-disable-line no-console
    });
};
