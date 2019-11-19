import _ from 'lodash';
import { compose, withProps } from 'recompose';
import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import { datasetRegistrationConnector } from './dataset-registration-connector';
import { datasetRegistrationnResolver } from './dataset-registration-resolver';

const mapRouteParams = withProps(({ match: { params } }) =>
  _.pick(params, ['catalogId', 'datasetId'])
);

const enhance = compose(
  mapRouteParams,
  datasetRegistrationConnector,
  datasetRegistrationnResolver
);
export const DatasetRegistrationPage = enhance(DatasetRegistrationPagePure);
