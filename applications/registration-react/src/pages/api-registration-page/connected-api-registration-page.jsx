import { connect } from 'react-redux';
import _ from 'lodash';
import {
  fetchApisIfNeededAction,
  getApiItemsByApiId
} from '../../redux/modules/apis';
import { getApiFormStatusById } from '../../redux/modules/api-form-status';
import { fetchHelptextsIfNeeded } from '../../redux/modules/helptexts';
import { fetchCatalogIfNeeded } from '../../redux/modules/catalog';
import { ResolvedAPIRegistrationPage } from './resolved-api-registration-page';

const mapStateToProps = (
  { apiFormStatus, apis, helptexts, catalog },
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
    item: getApiItemsByApiId(apis, catalogId, apiId),
    helptextItems
  };
};

const mapDispatchToProps = dispatch => ({
  fetchCatalogIfNeeded: catalogId => dispatch(fetchCatalogIfNeeded(catalogId)),
  fetchApisIfNeeded: catalogId => dispatch(fetchApisIfNeededAction(catalogId)),
  fetchHelptextsIfNeeded: () => dispatch(fetchHelptextsIfNeeded())
});

export const ConnectedAPIRegistrationPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolvedAPIRegistrationPage);
