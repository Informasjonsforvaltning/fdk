import { compose } from 'recompose';
import _ from 'lodash';

export const DATASET_FORM_STATUS_PATCH_SUCCESS =
  'DATASET_FORM_STATUS_PATCH_SUCCESS';
export const DATASET_FORM_STATUS_IS_SAVING = 'DATASET_FORM_STATUS_IS_SAVING';
export const DATASET_FORM_STATUS_SAVE_ERROR = 'DATASET_FORM_STATUS_SAVE_ERROR';

export const datasetFormPatchSuccessAction = ({ datasetId, patch }) => ({
  type: DATASET_FORM_STATUS_PATCH_SUCCESS,
  payload: { datasetId, patch }
});

export const datasetFormPatchIsSavingAction = ({ datasetId }) => ({
  type: DATASET_FORM_STATUS_IS_SAVING,
  payload: {
    datasetId
  }
});

export const datasetFormPatchErrorAction = ({ datasetId, error }) => ({
  type: DATASET_FORM_STATUS_SAVE_ERROR,
  payload: {
    datasetId,
    error
  }
});

const initialState = {};

export function datasetFormStatus(state = initialState, action) {
  switch (action.type) {
    case DATASET_FORM_STATUS_IS_SAVING: {
      const { datasetId } = action.payload;
      return {
        ...state,
        [datasetId]: {
          ..._.get(state, datasetId, {}),
          isSaving: true
        }
      };
    }
    case DATASET_FORM_STATUS_PATCH_SUCCESS: {
      const { datasetId, patch } = action.payload;
      const justPublishedOrUnPublished = !!patch.registrationStatus;
      return {
        ...state,
        [datasetId]: {
          justPublishedOrUnPublished,
          lastChangedFields: Object.keys(patch)
        }
      };
    }
    case DATASET_FORM_STATUS_SAVE_ERROR: {
      const { datasetId, error } = action.payload;
      return {
        ...state,
        [datasetId]: { error }
      };
    }
    default:
      return state;
  }
}

const selectorForDatasetFormStatusState = state => state.datasetFormStatus;

export const selectorForDatasetFormStatus = datasetId =>
  compose(state => state[datasetId], selectorForDatasetFormStatusState);
