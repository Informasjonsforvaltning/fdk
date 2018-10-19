import _ from 'lodash';

export const API_FORM_STATUS_LAST_SAVED = 'API_FORM_STATUS_LAST_SAVED';

export const apiFormPatchSuccessAction = (apiId, lastSavedDate) => ({
  type: API_FORM_STATUS_LAST_SAVED,
  payload: {
    apiId,
    apiLastSaved: lastSavedDate
  }
});

export default function apiFormStatus(state = {}, action) {
  switch (action.type) {
    case API_FORM_STATUS_LAST_SAVED:
      return {
        ...state,
        [action.payload.apiId]: {
          lastSaved: action.payload.apiLastSaved
        }
      };
    default:
      return state;
  }
}

export const getApiFormStatusById = (apiFormStatus, apiId) =>
  _.get(apiFormStatus, apiId);
