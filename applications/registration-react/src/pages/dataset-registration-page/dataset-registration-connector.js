import { connect } from 'react-redux';
import _ from 'lodash';

import {
  deleteDatasetThunk,
  selectorForDataset,
  selectorForDatasetsInCatalog
} from '../../redux/modules/datasets';
import { toggleInputLanguage } from '../../components/language-picker/redux/actions';
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
  const {
    form,
    referenceData,
    inputLanguage: { languages }
  } = state;
  const datasetFormStatus = selectorForDatasetFormStatus(datasetId)(state);
  const datasetItem = selectorForDataset(catalogId, datasetId)(state);
  const referenceDatasetsItems = Object.values(
    selectorForDatasetsInCatalog(catalogId)(state)
  );

  return {
    form,
    datasetFormStatus,
    datasetItem,
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
    referenceDatasetsItems,
    openLicenseItems: _.get(referenceData, [
      'items',
      REFERENCEDATA_PATH_OPENLICENCES
    ]),
    losItems: _.get(referenceData, ['items', REFERENCEDATA_PATH_LOS]),
    languages
  };
};

const mapDispatchToProps = {
  dispatchEnsureData: datasetRegistrationEnsureDataThunk,
  dispatchDeleteDataset: deleteDatasetThunk,
  toggleInputLanguage
};

export const datasetRegistrationConnector = connect(
  mapStateToProps,
  mapDispatchToProps
);
