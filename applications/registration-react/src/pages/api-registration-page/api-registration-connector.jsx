import { batch, connect } from 'react-redux';
import _ from 'lodash';

import {
  apiSuccessAction,
  deleteApiAction,
  fetchApisIfNeededAction,
  getApiItemsByApiId
} from '../../redux/modules/apis';
import { getApiFormStatusById } from '../../redux/modules/api-form-status';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import {
  REFERENCEDATA_PATH_APISERVICETYPE,
  REFERENCEDATA_PATH_APISTATUS
} from '../../redux/modules/referenceData';

const mapStateToProps = (
  { apiFormStatus, apis, catalog, referenceData },
  ownProps
) => {
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAfterRender: () => {
    const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
    const { referenceDataApiActions } = ownProps;

    batch(() => {
      dispatch(fetchCatalogIfNeeded(catalogId));
      dispatch(fetchApisIfNeededAction(catalogId));
      dispatch(
        referenceDataApiActions.fetchReferenceDataIfNeededAction(
          REFERENCEDATA_PATH_APISTATUS
        )
      );
      dispatch(
        referenceDataApiActions.fetchReferenceDataIfNeededAction(
          REFERENCEDATA_PATH_APISERVICETYPE
        )
      );
    });
  },
  deleteApiItem: (catalogId, apiId) =>
    dispatch(deleteApiAction(catalogId, apiId)),
  apiSuccess: apiItem => dispatch(apiSuccessAction(apiItem))
});

export const apiRegistrationConnector = connect(
  mapStateToProps,
  mapDispatchToProps
);
