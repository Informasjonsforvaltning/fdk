import _ from 'lodash';

export const API_FORM_STATUS_LAST_SAVED = 'API_FORM_STATUS_LAST_SAVED';
export const API_FORM_STATUS_IS_SAVING = 'API_FORM_STATUS_IS_SAVING';
export const API_FORM_STATUS_SAVE_ERROR = 'API_FORM_STATUS_SAVE_ERROR';
export const API_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED =
  'API_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED';

export const apiFormPatchSuccessAction = apiId => ({
  type: API_FORM_STATUS_LAST_SAVED,
  payload: {
    apiId
  }
});

export const apiFormPatchIsSavingAction = apiId => ({
  type: API_FORM_STATUS_IS_SAVING,
  payload: {
    apiId
  }
});

export const apiFormPatchErrorAction = (apiId, error) => ({
  type: API_FORM_STATUS_SAVE_ERROR,
  payload: {
    apiId,
    error
  }
});

export const apiFormPatchJustPublishedOrUnPublishedAction = (
  apiId,
  justChanged,
  status
) => ({
  type: API_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED,
  payload: {
    apiId,
    justChanged,
    status
  }
});

const initialState = {};

export default function apiFormStatus(state = initialState, action) {
  switch (action.type) {
    case API_FORM_STATUS_IS_SAVING:
      return {
        ...state,
        [action.payload.apiId]: {
          ..._.get(state, _.get(action.payload, 'apiId'), []),
          isSaving: true
        }
      };
    case API_FORM_STATUS_LAST_SAVED:
      return {
        ...state,
        [action.payload.apiId]: {
          ..._.get(state, _.get(action.payload, 'apiId'), []),
          isSaving: false,
          error: null
        }
      };
    case API_FORM_STATUS_SAVE_ERROR:
      return {
        ...state,
        [action.payload.apiId]: {
          ..._.get(state, _.get(action.payload, 'apiId'), []),
          isSaving: false,
          justPublishedOrUnPublished: false,
          error: action.payload.error
        }
      };
    case API_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED:
      return {
        ...state,
        [action.payload.apiId]: {
          ..._.get(state, _.get(action.payload, 'apiId'), []),
          justPublishedOrUnPublished: action.payload.justChanged,
          status: action.payload.status
        }
      };
    default:
      return state;
  }
}

export const getApiFormStatusById = (apiFormStatus, apiId) =>
  _.get(apiFormStatus, apiId);
