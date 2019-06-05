import { compose } from 'recompose';
import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import { datasetRegistrationConnector } from './dataset-registration-connector';

const enhance = compose(datasetRegistrationConnector);
export const DatasetRegistrationPage = enhance(DatasetRegistrationPagePure);
