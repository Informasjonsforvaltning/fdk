import { compose } from 'recompose';
import { FormDistributionApiPure } from './form-distribution-api-pure';
import { resolver } from './resolver';
import { formConfigurer } from './form-configurer';
import { propsEnhancer } from './props-enhancer';
import { connector } from './connector';

const enhance = compose(
  connector,
  propsEnhancer,
  formConfigurer,
  resolver
);

export const FormDistributionApi = enhance(FormDistributionApiPure);
