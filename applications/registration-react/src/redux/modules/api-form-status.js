import _ from 'lodash';

export const API_FORM_STATUS_PATCH_SUCCESS = 'API_FORM_STATUS_PATCH_SUCCESS';
export const API_FORM_STATUS_IS_SAVING = 'API_FORM_STATUS_IS_SAVING';
export const API_FORM_STATUS_SAVE_ERROR = 'API_FORM_STATUS_SAVE_ERROR';

export const apiFormPatchSuccessAction = ({ apiId, patch }) => ({
  type: API_FORM_STATUS_PATCH_SUCCESS,
  payload: { apiId, patch }
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

const initialState = {};

export function apiFormStatusReducer(state = initialState, action) {
  switch (action.type) {
    case API_FORM_STATUS_IS_SAVING: {
      const { apiId } = action.payload;
      return {
        ...state,
        [apiId]: { isSaving: true }
      };
    }
    case API_FORM_STATUS_PATCH_SUCCESS: {
      const { apiId, patch } = action.payload;
      const justPublishedOrUnPublished = !!patch.registrationStatus;

      return {
        ...state,
        [apiId]: { justPublishedOrUnPublished }
      };
    }
    case API_FORM_STATUS_SAVE_ERROR: {
      const { apiId, error } = action.payload;
      return {
        ...state,
        [apiId]: { error }
      };
    }
    default:
      return state;
  }
}

export const getApiFormStatusById = (apiFormStatus, apiId) =>
  _.get(apiFormStatus, apiId);
