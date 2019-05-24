import { ResolvedAPIRegistrationPage } from './resolved-api-registration-page';
import { apiRegistrationConnector } from './api-registration-connector';

export const ConnectedAPIRegistrationPage = apiRegistrationConnector(
  ResolvedAPIRegistrationPage
);
