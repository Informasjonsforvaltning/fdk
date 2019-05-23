import { connect } from 'react-redux';
import _ from 'lodash';

import {
  fetchApisIfNeededAction,
  getApiItemsByApiId,
  deleteApiAction,
  apiSuccessAction
} from '../../redux/modules/apis';
import { getApiFormStatusById } from '../../redux/modules/api-form-status';
import { fetchHelptextsIfNeeded } from '../../redux/modules/helptexts';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import {
  REFERENCEDATA_PATH_APISTATUS,
  REFERENCEDATA_PATH_APISERVICETYPE,
  fetchReferenceDataIfNeededAction
} from '../../redux/modules/referenceData';
import { ResolvedAPIRegistrationPage } from './resolved-api-registration-page';

const mapStateToProps = (
  { apiFormStatus, apis, helptexts, catalog, referenceData },
  ownProps
) => {
  const { helptextItems } = helptexts || {
    helptextItems: null
  };

  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  const apiId = _.get(ownProps, ['match', 'params', 'id']);

  return {
    catalogItem: _.get(catalog, ['items', catalogId]),
    lastSaved: _.get(getApiFormStatusById(apiFormStatus, apiId), 'lastSaved'),
    isSaving: _.get(getApiFormStatusById(apiFormStatus, apiId), 'isSaving'),
    error: _.get(getApiFormStatusById(apiFormStatus, apiId), 'error'),
    justPublishedOrUnPublished: _.get(
      getApiFormStatusById(apiFormStatus, apiId),
      'justPublishedOrUnPublished'
    ),
    registrationStatus: _.get(
      getApiFormStatusById(apiFormStatus, apiId),
      'status'
    ),
    item: getApiItemsByApiId(apis, catalogId, apiId),
    helptextItems,
    history: _.get(ownProps, 'history'),
    match: _.get(ownProps, 'match'),
    apiStatusItems: _.filter(
      _.get(referenceData, ['items', REFERENCEDATA_PATH_APISTATUS]),
      item => !!item.code
    ),
    apiServiceTypeItems: _.filter(
      _.get(referenceData, ['items', REFERENCEDATA_PATH_APISERVICETYPE]),
      item => !!item.code
    )
  };
};

const mapDispatchToProps = dispatch => ({
  fetchCatalogIfNeeded: catalogId => dispatch(fetchCatalogIfNeeded(catalogId)),
  fetchApisIfNeeded: catalogId => dispatch(fetchApisIfNeededAction(catalogId)),
  fetchHelptextsIfNeeded: () => dispatch(fetchHelptextsIfNeeded()),
  fetchApiStatusIfNeeded: () =>
    dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_APISTATUS)),
  fetchApiServiceTypeIfNeeded: () =>
    dispatch(
      fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_APISERVICETYPE)
    ),
  deleteApiItem: (catalogId, apiId) =>
    dispatch(deleteApiAction(catalogId, apiId)),
  apiSuccess: apiItem => dispatch(apiSuccessAction(apiItem))
});

export const ConnectedAPIRegistrationPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedAPIRegistrationPage);
