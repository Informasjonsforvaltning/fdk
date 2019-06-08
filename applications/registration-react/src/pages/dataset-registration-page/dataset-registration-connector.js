import { connect } from 'react-redux';
import _ from 'lodash';

import {
  deleteDatasetThunk,
  getDatasetItemByDatasetiId,
  getDatasetItemsByCatalogId
} from '../../redux/modules/datasets';
import {
  REFERENCEDATA_PATH_FREQUENCY,
  REFERENCEDATA_PATH_LOS,
  REFERENCEDATA_PATH_OPENLICENCES,
  REFERENCEDATA_PATH_PROVENANCE,
  REFERENCEDATA_PATH_REFERENCETYPES,
  REFERENCEDATA_PATH_THEMES
} from '../../redux/modules/referenceData';
import { selectorForDatasetFormStatus } from '../../redux/modules/dataset-form-status';
import { datasetRegistrationEnsureDataThunk } from './dataset-registration-ensure-data-thunk';

const mapStateToProps = (state, { catalogId, datasetId }) => {
  const { form, datasets, referenceData } = state;
  const datasetFormStatus = selectorForDatasetFormStatus(datasetId)(state);

  return {
    form,
    datasetFormStatus,
    provenanceItems: _.get(referenceData, [
      'items',
      REFERENCEDATA_PATH_PROVENANCE
    ]),
    frequencyItems: _.get(referenceData, [
      'items',
      REFERENCEDATA_PATH_FREQUENCY
    ]),
    themesItems: _.get(referenceData, ['items', REFERENCEDATA_PATH_THEMES]),
    referenceTypesItems: _.get(referenceData, [
      'items',
      REFERENCEDATA_PATH_REFERENCETYPES
    ]),
    referenceDatasetsItems: getDatasetItemsByCatalogId(datasets, catalogId),
    openLicenseItems: _.get(referenceData, [
      'items',
      REFERENCEDATA_PATH_OPENLICENCES
    ]),
    datasetItem: getDatasetItemByDatasetiId(datasets, catalogId, datasetId),
    losItems: _.get(referenceData, ['items', REFERENCEDATA_PATH_LOS])
  };
};

const mapDispatchToProps = {
  dispatchEnsureData: datasetRegistrationEnsureDataThunk,
  dispatchDeleteDataset: deleteDatasetThunk
};

export const datasetRegistrationConnector = connect(
  mapStateToProps,
  mapDispatchToProps
);
