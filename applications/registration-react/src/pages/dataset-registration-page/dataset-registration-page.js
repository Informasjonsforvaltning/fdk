import _ from 'lodash';
import { compose, withProps } from 'recompose';
import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import { datasetRegistrationConnector } from './dataset-registration-connector';
import { datasetRegistrationResolver } from './dataset-registration-resolver';
import { authService } from '../../services/auth/auth-service';

const mapRouteParams = withProps(({ match: { params } }) =>
  _.pick(params, ['catalogId', 'datasetId'])
);

const withReadOnly = withProps(({ catalogId }) => ({
  isReadOnly: !authService.hasOrganizationWritePermission(catalogId)
}));

const enhance = compose(
  mapRouteParams,
  withReadOnly,
  datasetRegistrationConnector,
  datasetRegistrationResolver
);
export const DatasetRegistrationPage = enhance(DatasetRegistrationPagePure);
