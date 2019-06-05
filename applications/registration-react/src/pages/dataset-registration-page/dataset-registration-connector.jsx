import { batch, connect } from 'react-redux';
import _ from 'lodash';

import {
  deleteDatasetAction,
  fetchDatasetsIfNeeded,
  getDatasetItemByDatasetiId,
  getDatasetItemsByCatalogId
} from '../../redux/modules/datasets';
import {
  fetchReferenceDataIfNeededAction,
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

const mapDispatchToProps = (dispatch, { match }) => ({
  onChangeDatasetId: () => {
    const catalogId = _.get(match, ['params', 'catalogId']);

    batch(() => {
      dispatch(fetchDatasetsIfNeeded(catalogId));
      dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_PROVENANCE));
      dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_FREQUENCY));
      dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_THEMES));
      dispatch(
        fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_REFERENCETYPES)
      );
      dispatch(
        fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_OPENLICENCES)
      );
      dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_LOS));
    });
  },

  deleteDatasetItem: (catalogId, datasetId) =>
    dispatch(deleteDatasetAction(catalogId, datasetId))
});

export const datasetRegistrationConnector = connect(
  mapStateToProps,
  mapDispatchToProps
);
