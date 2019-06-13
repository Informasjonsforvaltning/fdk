import {
  datasetFormPatchErrorAction,
  datasetFormPatchIsSavingAction,
  datasetFormPatchSuccessAction
} from '../../../redux/modules/dataset-form-status';
import { datasetSuccessAction } from '../../../redux/modules/datasets';
import { patchDataset } from '../../../api/dataset-registration-api';

export const datasetFormPatchThunk = ({
  catalogId,
  datasetId,
  patch
}) => dispatch => {
  if (!(catalogId && datasetId)) {
    throw new Error('catalogId and datasetId required');
  }

  dispatch(datasetFormPatchIsSavingAction({ datasetId }));

  return patchDataset(catalogId, datasetId, patch)
    .then(dataset => {
      dispatch(datasetFormPatchSuccessAction({ datasetId, patch }));
      dispatch(datasetSuccessAction(dataset));
    })
    .catch(error =>
      dispatch(
        datasetFormPatchErrorAction({
          datasetId,
          error
        })
      )
    );
};

export const asyncValidateDatasetInvokePatch = (values, dispatch, props) => {
  const { catalogId, datasetId } = props;

  return dispatch(
    datasetFormPatchThunk({ catalogId, datasetId, patch: values })
  ).catch(console.error); // handle rejects because form validation api expects certain format of rejects
};
