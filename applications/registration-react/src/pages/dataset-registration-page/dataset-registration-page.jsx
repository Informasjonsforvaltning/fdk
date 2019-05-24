import { compose } from 'recompose';
import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import { datasetRegistrationConnector } from './dataset-registration-connector';
import { withInjectables } from '../../lib/injectables';

const enhance = compose(
  withInjectables(['referenceDataApiActions']),
  datasetRegistrationConnector
);
export const DatasetRegistrationPage = enhance(DatasetRegistrationPagePure);
