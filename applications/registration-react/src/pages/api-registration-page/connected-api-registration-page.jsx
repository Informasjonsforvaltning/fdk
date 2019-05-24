import { apiRegistrationConnector } from './api-registration-connector';
import { APIRegistrationPage } from './api-registration-page';
import { apiRegistrationResolver } from './api-registration-resolver';

export const ConnectedAPIRegistrationPage = apiRegistrationConnector(
  apiRegistrationResolver(APIRegistrationPage)
);
