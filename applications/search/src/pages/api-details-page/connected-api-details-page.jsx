import { connect } from 'react-redux';

import { ApiDetailsPage } from './api-details-page';
import { fakeApiItem } from './fixtures/fake-api-item';

const mapStateToProps = ({}) => ({
  apiItem: fakeApiItem
});

const mapDispatchToProps = dispatch => ({});

export const ConnectedApiDetailsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApiDetailsPage);
