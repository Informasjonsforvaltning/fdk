import { compose } from 'recompose';
import { apiRegistrationConnector } from './api-registration-connector';
import { ApiRegistrationPagePure } from './api-registration-page-pure';
import { apiRegistrationResolver } from './api-registration-resolver';
import { apiRegistrationStateEnhancer } from './api-registration-state-enhancer';

const enhance = compose(
  apiRegistrationConnector,
  apiRegistrationResolver,
  apiRegistrationStateEnhancer
);
export const ApiRegistrationPage = enhance(ApiRegistrationPagePure);
