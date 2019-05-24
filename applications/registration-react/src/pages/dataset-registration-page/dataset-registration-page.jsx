import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import { datasetRegistrationConnector } from './dataset-registration-connector';

export const DatasetRegistrationPage = datasetRegistrationConnector(
  DatasetRegistrationPagePure
);
