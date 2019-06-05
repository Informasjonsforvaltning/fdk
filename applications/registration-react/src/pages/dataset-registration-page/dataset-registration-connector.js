import { connect } from 'react-redux';
import _ from 'lodash';

import {
  deleteDatasetAction,
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
import { datasetRegistrationEnsureDataThunk } from './dataset-registration-ensure-data-thunk';

const mapStateToProps = (
  { form, datasetFormStatus, datasets, referenceData },
  { catalogId, datasetId }
) => {
  const title = form && form.title ? form.title : {};

  const accessRights = form && form.accessRights ? form.accessRights : {};

  const formThemes = form && form.themes ? form.themes : {};

  const type = form && form.type ? form.type : {};

  const concept = form && form.concept ? form.concept : {};

  const spatial = form && form.spatial ? form.spatial : {};

  const formProvenance = form && form.provenance ? form.provenance : {};

  const contents = form && form.contents ? form.contents : {};

  const informationModel =
    form && form.informationModel ? form.informationModel : {};

  const reference = form && form.reference ? form.reference : {};

  const contactPoint = form && form.contactPoint ? form.contactPoint : {};

  const distribution = form && form.distribution ? form.distribution : {};

  const sample = form && form.sample ? form.sample : {};

  return {
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
    title,
    accessRights,
    formThemes,
    type,
    concept,
    spatial,
    formProvenance,
    contents,
    informationModel,
    reference,
    contactPoint,
    distribution,
    sample,
    lastSaved: _.get(
      getDatasetFormStatusById(datasetFormStatus, datasetId),
      'lastSaved'
    ),
    isSaving: _.get(
      getDatasetFormStatusById(datasetFormStatus, datasetId),
      'isSaving'
    ),
    error: _.get(
      getDatasetFormStatusById(datasetFormStatus, datasetId),
      'error'
    ),
    justPublishedOrUnPublished: _.get(
      getDatasetFormStatusById(datasetFormStatus, datasetId),
      'justPublishedOrUnPublished'
    ),
    registrationStatus: _.get(
      getDatasetFormStatusById(datasetFormStatus, datasetId),
      'status'
    ),
    datasetItem: getDatasetItemByDatasetiId(datasets, catalogId, datasetId),
    losItems: _.get(referenceData, ['items', REFERENCEDATA_PATH_LOS])
  };
};

const mapDispatchToProps = (dispatch, { catalogId }) => ({
  onChangeDatasetId: () =>
    dispatch(datasetRegistrationEnsureDataThunk(catalogId)),

  deleteDatasetItem: (catalogId, datasetId) =>
    dispatch(deleteDatasetAction(catalogId, datasetId))
});

export const datasetRegistrationConnector = connect(
  mapStateToProps,
  mapDispatchToProps
);
