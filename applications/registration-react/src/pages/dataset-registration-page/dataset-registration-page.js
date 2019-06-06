import _ from 'lodash';
import { compose, withProps } from 'recompose';
import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import { datasetRegistrationConnector } from './dataset-registration-connector';

const mapRouteParams = withProps(({ match: { params } }) =>
  _.pick(params, ['catalogId', 'datasetId'])
);

const enhance = compose(
  mapRouteParams,
  datasetRegistrationConnector
);
export const DatasetRegistrationPage = enhance(DatasetRegistrationPagePure);
