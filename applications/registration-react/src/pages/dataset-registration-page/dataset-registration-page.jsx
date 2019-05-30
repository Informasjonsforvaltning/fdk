import { compose } from 'recompose';

import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import { datasetRegistrationConnector } from './dataset-registration-connector';
import { datasetRegistrationEnsureData } from './dataset-registration-ensuredata';

const enhance = compose(
  datasetRegistrationEnsureData,
  datasetRegistrationConnector
);
export const DatasetRegistrationPage = enhance(DatasetRegistrationPagePure);
