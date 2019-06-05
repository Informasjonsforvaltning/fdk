import { compose } from 'recompose';
import { FormDistributionApiPure } from './form-distribution-api-pure';
import { resolver } from './resolver';
import { formConfigurer } from './form-configurer';
import { propsEnhancer } from './props-enhancer';

const enhance = compose(
  propsEnhancer,
  formConfigurer,
  resolver
);

export const FormDistributionApi = enhance(FormDistributionApiPure);
