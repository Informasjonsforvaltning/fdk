import { RegDataset } from './dataset-registration-page';
import { datasetRegistrationConnector } from './dataset-registration-connector';

export const ConnectedDatasetRegistrationPage = datasetRegistrationConnector(
  RegDataset
);
