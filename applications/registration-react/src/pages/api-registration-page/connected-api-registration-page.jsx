import { connect } from 'react-redux';
import _ from 'lodash';
import {
  fetchApisIfNeededAction,
  getApiItemsByApiId
} from '../../redux/modules/apis';
import { APIRegistrationPage } from './api-registration-page';

const mapStateToProps = ({ apis }, ownProps) => {
  const catalogId = _.get(ownProps, ['match', 'params', 'catalogId']);
  const apiId = _.get(ownProps, ['match', 'params', 'id']);
  return {
    item: getApiItemsByApiId(apis, catalogId, apiId)
  };
};

const mapDispatchToProps = dispatch => ({
  fetchApisIfNeeded: catalogId => dispatch(fetchApisIfNeededAction(catalogId))
});

export const ConnectedAPIRegistrationPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(APIRegistrationPage);
