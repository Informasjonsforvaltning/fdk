import { connect } from 'react-redux';
import _ from 'lodash';

import {
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
import { getDatasetFormStatusById } from '../../redux/modules/dataset-form-status';

const mapStateToProps = (
  { form, datasetFormStatus, datasets, referenceData },
  ownProps
) => {
  const id = _.get(ownProps, ['match', 'params', 'id']);
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  return {
    form,
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
    lastSaved: _.get(
      getDatasetFormStatusById(datasetFormStatus, id),
      'lastSaved'
    ),
    isSaving: _.get(
      getDatasetFormStatusById(datasetFormStatus, id),
      'isSaving'
    ),
    error: _.get(getDatasetFormStatusById(datasetFormStatus, id), 'error'),
    justPublishedOrUnPublished: _.get(
      getDatasetFormStatusById(datasetFormStatus, id),
      'justPublishedOrUnPublished'
    ),
    registrationStatus: _.get(
      getDatasetFormStatusById(datasetFormStatus, id),
      'status'
    ),
    datasetItem: getDatasetItemByDatasetiId(datasets, catalogId, id),
    catalogId,
    datasetId: id,
    losItems: _.get(referenceData, ['items', REFERENCEDATA_PATH_LOS])
  };
};

const mapDispatchToProps = (dispatch, { datasetApiActions }) => ({
  deleteDatasetItem: (catalogId, datasetId) =>
    dispatch(datasetApiActions.deleteDatasetAction(catalogId, datasetId))
});

export const datasetRegistrationConnector = connect(
  mapStateToProps,
  mapDispatchToProps
);
