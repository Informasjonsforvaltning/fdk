import { connect } from 'react-redux';
import pick from 'lodash/pick';
import { withProps, compose } from 'recompose';
import { addApiItemAction } from '../../redux/modules/apis';
import { ApiImportPagePure } from './api-import-page-pure';

const mapDispatchToProps = dispatch => ({
  addApiItem: payload => dispatch(addApiItemAction(payload))
});

const enhance = compose(
  withProps(({ match: { params } }) => pick(params, 'catalogId')),
  connect(null, mapDispatchToProps)
);

export const ApiImportPage = enhance(ApiImportPagePure);
