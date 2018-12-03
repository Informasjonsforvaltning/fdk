import _ from 'lodash';

export const DATASET_FORM_STATUS_LAST_SAVED = 'DATASET_FORM_STATUS_LAST_SAVED';
export const DATASET_FORM_STATUS_IS_SAVING = 'DATASET_FORM_STATUS_IS_SAVING';
export const DATASET_FORM_STATUS_SAVE_ERROR = 'DATASET_FORM_STATUS_SAVE_ERROR';
export const DATASET_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED =
  'DATASET_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED';

export const datasetFormPatchSuccessAction = (datasetId, lastSavedDate) => ({
  type: DATASET_FORM_STATUS_LAST_SAVED,
  payload: {
    datasetId,
    datasetLastSaved: lastSavedDate
  }
});

export const datasetFormPatchIsSavingAction = datasetId => ({
  type: DATASET_FORM_STATUS_IS_SAVING,
  payload: {
    datasetId
  }
});

export const datasetFormPatchErrorAction = (datasetId, error) => ({
  type: DATASET_FORM_STATUS_SAVE_ERROR,
  payload: {
    datasetId,
    error
  }
});

export const datasetFormPatchJustPublishedOrUnPublishedAction = (
  datasetId,
  justChanged,
  status
) => ({
  type: DATASET_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED,
  payload: {
    datasetId,
    justChanged,
    status
  }
});

const initialState = {};

export function datasetFormStatus(state = initialState, action) {
  switch (action.type) {
    case DATASET_FORM_STATUS_IS_SAVING:
      return {
        ...state,
        [action.payload.datasetId]: {
          ..._.get(state, _.get(action.payload, 'datasetId'), []),
          isSaving: true
        }
      };
    case DATASET_FORM_STATUS_LAST_SAVED:
      return {
        ...state,
        [action.payload.datasetId]: {
          ..._.get(state, _.get(action.payload, 'datasetId'), []),
          lastSaved: action.payload.datasetLastSaved,
          isSaving: false,
          error: null
        }
      };
    case DATASET_FORM_STATUS_SAVE_ERROR:
      return {
        ...state,
        [action.payload.datasetId]: {
          ..._.get(state, _.get(action.payload, 'datasetId'), []),
          isSaving: false,
          justPublishedOrUnPublished: false,
          error: action.payload.error
        }
      };
    case DATASET_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED:
      return {
        ...state,
        [action.payload.datasetId]: {
          ..._.get(state, _.get(action.payload, 'datasetId'), []),
          justPublishedOrUnPublished: action.payload.justChanged,
          status: action.payload.status
        }
      };
    default:
      return state;
  }
}

export const getDatasetFormStatusById = (datasetFormStatus, datasetId) =>
  _.get(datasetFormStatus, datasetId);
