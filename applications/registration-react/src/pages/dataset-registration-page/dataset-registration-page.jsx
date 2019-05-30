import _ from 'lodash';
import { compose, mapProps } from 'recompose';
import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import { datasetRegistrationConnector } from './dataset-registration-connector';
import { withDispatchOnPropsChange } from '../../lib/redux-dispatch-on-props-change';
import { datasetRegistrationEnsureDataThunk } from './dataset-registration-ensure-data-thunk';

const mapRouteParams = mapProps(({ match: { params } }) =>
  _.pick(params, ['catalogId', 'datasetId'])
);

const ensureData = withDispatchOnPropsChange(
  (dispatch, props) =>
    dispatch(datasetRegistrationEnsureDataThunk(props.catalogId)),
  props => [props.catalogId]
);

const enhance = compose(
  mapRouteParams,
  ensureData,
  datasetRegistrationConnector
);
export const DatasetRegistrationPage = enhance(DatasetRegistrationPagePure);
