import { compose } from 'recompose';

export const DATASET_FORM_STATUS_LAST_SAVED = 'DATASET_FORM_STATUS_LAST_SAVED';
export const DATASET_FORM_STATUS_IS_SAVING = 'DATASET_FORM_STATUS_IS_SAVING';
export const DATASET_FORM_STATUS_SAVE_ERROR = 'DATASET_FORM_STATUS_SAVE_ERROR';
export const DATASET_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED =
  'DATASET_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED';

export const datasetFormPatchSuccessAction = ({ datasetId }) => ({
  type: DATASET_FORM_STATUS_LAST_SAVED,
  payload: {
    datasetId
  }
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

export const datasetFormPatchJustPublishedOrUnPublishedAction = ({
  datasetId,
  justChanged
}) => ({
  type: DATASET_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED,
  payload: {
    datasetId,
    justChanged
  }
});

const initialState = {};

export function datasetFormStatus(state = initialState, action) {
  switch (action.type) {
    case DATASET_FORM_STATUS_IS_SAVING: {
      const { datasetId } = action.payload;
      return {
        ...state,
        [datasetId]: { isSaving: true }
      };
    }
    case DATASET_FORM_STATUS_LAST_SAVED: {
      const { datasetId } = action.payload;
      return {
        ...state,
        [datasetId]: {}
      };
    }
    case DATASET_FORM_STATUS_SAVE_ERROR: {
      const { datasetId, error } = action.payload;
      return {
        ...state,
        [datasetId]: { error }
      };
    }
    case DATASET_FORM_STATUS_JUSTPUBLISHEDORUNPUBLISHED: {
      const { datasetId, justChanged } = action.payload;
      return {
        ...state,
        [datasetId]: {
          justPublishedOrUnPublished: justChanged
        }
      };
    }
    default:
      return state;
  }
}

const selectorForDatasetFormStatusState = state => state.datasetFormStatus;

export const selectorForDatasetFormStatus = datasetId =>
  compose(
    state => state[datasetId],
    selectorForDatasetFormStatusState
  );
