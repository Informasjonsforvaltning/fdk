import { connect } from 'react-redux';
import _ from 'lodash';

import {
  fetchProvenanceIfNeeded,
  fetchFrequencyIfNeeded,
  fetchThemesIfNeeded,
  fetchReferenceTypesIfNeeded,
  fetchReferenceDatasetsIfNeeded,
  fetchOpenLicensesIfNeeded
} from '../../actions/index';
import {
  fetchDatasetsIfNeeded,
  deleteDatasetItemAction,
  getDatasetItemByDatasetiId
} from '../../redux/modules/datasets';
import { fetchHelptextsIfNeeded } from '../../redux/modules/helptexts';
import { getDatasetFormStatusById } from '../../redux/modules/dataset-form-status';
import { RegDataset } from './dataset-registration-page';

const mapStateToProps = (
  {
    helptexts,
    provenance,
    frequency,
    themes,
    referenceTypes,
    referenceDatasets,
    openlicenses,
    form,
    datasetFormStatus,
    datasets
  },
  ownProps
) => {
  const id = _.get(ownProps, ['match', 'params', 'id']);
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);

  const { helptextItems } = helptexts || {
    helptextItems: null
  };

  const { provenanceItems } = provenance || {
    provenanceItems: null
  };

  const { frequencyItems } = frequency || {
    frequencyItems: null
  };

  const { themesItems } = themes || {
    themesItems: null
  };

  const { referenceTypesItems } = referenceTypes || {
    referenceTypesItems: null
  };

  const { referenceDatasetsItems } = referenceDatasets || {
    referenceDatasetsItems: null
  };

  const { openLicenseItems } = openlicenses || {
    openLicenseItems: null
  };

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
    helptextItems,
    provenanceItems,
    frequencyItems,
    themesItems,
    referenceTypesItems,
    referenceDatasetsItems,
    openLicenseItems,
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
    datasetId: id
  };
};

const mapDispatchToProps = dispatch => ({
  fetchProvenanceIfNeeded: () => dispatch(fetchProvenanceIfNeeded()),
  fetchFrequencyIfNeeded: () => dispatch(fetchFrequencyIfNeeded()),
  fetchThemesIfNeeded: () => dispatch(fetchThemesIfNeeded()),
  fetchReferenceTypesIfNeeded: () => dispatch(fetchReferenceTypesIfNeeded()),
  fetchReferenceDatasetsIfNeeded: catalogDatasetsURL =>
    dispatch(fetchReferenceDatasetsIfNeeded(catalogDatasetsURL)),
  fetchOpenLicensesIfNeeded: () => dispatch(fetchOpenLicensesIfNeeded()),
  fetchHelptextsIfNeeded: () => dispatch(fetchHelptextsIfNeeded()),
  deleteDatasetItem: (catalogId, id) =>
    dispatch(deleteDatasetItemAction(catalogId, id)),
  fetchDatasetsIfNeeded: catalogId => dispatch(fetchDatasetsIfNeeded(catalogId))
});

export const ConnectedDatasetRegistrationPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegDataset);
