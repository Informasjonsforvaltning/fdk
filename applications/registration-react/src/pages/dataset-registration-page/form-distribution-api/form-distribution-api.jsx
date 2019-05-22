import { compose } from 'recompose';
import { FormDistributionApiPure } from './form-distribution-api-pure';
import { resolver } from './resolver';
import { formConfigurer } from './form-configurer';
import { propsEnhancer } from './props-enhancer';
import { injector } from './injector';

const enhance = compose(
  propsEnhancer,
  formConfigurer,
  resolver,
  injector
);

export const FormDistributionApi = enhance(FormDistributionApiPure);
