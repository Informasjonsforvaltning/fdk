import _ from 'lodash';
import { compose, withProps } from 'recompose';

import { apiRegistrationConnector } from './api-registration-connector';
import { ApiRegistrationPagePure } from './api-registration-page-pure';
import { apiRegistrationResolver } from './api-registration-resolver';
import { apiRegistrationStateEnhancer } from './api-registration-state-enhancer';

const mapRouteParams = withProps(({ match: { params } }) =>
  _.pick(params, ['catalogId', 'apiId'])
);

const enhance = compose(
  mapRouteParams,
  apiRegistrationConnector,
  apiRegistrationResolver,
  apiRegistrationStateEnhancer
);
export const ApiRegistrationPage = enhance(ApiRegistrationPagePure);
