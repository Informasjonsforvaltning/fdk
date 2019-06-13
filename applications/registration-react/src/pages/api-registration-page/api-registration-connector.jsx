import { batch, connect } from 'react-redux';
import _ from 'lodash';

import {
  apiSuccessAction,
  deleteApiThunk,
  fetchApisIfNeededAction,
  getApiItemsByApiId
} from '../../redux/modules/apis';
import { getApiFormStatusById } from '../../redux/modules/api-form-status';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import {
  fetchReferenceDataIfNeededAction,
  REFERENCEDATA_PATH_APISERVICETYPE,
  REFERENCEDATA_PATH_APISTATUS
} from '../../redux/modules/referenceData';

const mapStateToProps = (state, ownProps) => {
  const { apiFormStatus, apis, catalog, referenceData } = state;
  const { catalogId, apiId } = ownProps;
  return {
    catalogItem: _.get(catalog, ['items', catalogId]),
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
  dispatchEnsureData: () => {
    const { catalogId } = ownProps;

    batch(() => {
      dispatch(fetchCatalogIfNeeded(catalogId));
      dispatch(fetchApisIfNeededAction(catalogId));
      dispatch(fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_APISTATUS));
      dispatch(
        fetchReferenceDataIfNeededAction(REFERENCEDATA_PATH_APISERVICETYPE)
      );
    });
  },
  dispatchDeleteApi: (catalogId, apiId) =>
    dispatch(deleteApiThunk(catalogId, apiId)),
  apiSuccess: apiItem => dispatch(apiSuccessAction(apiItem))
});

export const apiRegistrationConnector = connect(
  mapStateToProps,
  mapDispatchToProps
);
