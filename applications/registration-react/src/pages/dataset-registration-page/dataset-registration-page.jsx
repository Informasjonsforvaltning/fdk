import { compose } from 'recompose';

import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import { datasetRegistrationConnector } from './dataset-registration-connector';
import { withInjectables } from '../../lib/injectables';
import { datasetRegistrationEnsureData } from './dataset-registration-ensuredata';

const enhance = compose(
  withInjectables(['referenceDataApiActions', 'datasetApiActions']),
  datasetRegistrationEnsureData,
  datasetRegistrationConnector
);
export const DatasetRegistrationPage = enhance(DatasetRegistrationPagePure);
