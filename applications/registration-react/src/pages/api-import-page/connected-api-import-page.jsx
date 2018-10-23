import { connect } from 'react-redux';
import { addApiItemAction } from '../../redux/modules/apis';
import { ApiImportPage } from './api-import-page';

const mapDispatchToProps = dispatch => ({
  addApiItem: payload => dispatch(addApiItemAction(payload))
});

export const ConnectedApiImportPage = connect(
  null,
  mapDispatchToProps
)(ApiImportPage);
