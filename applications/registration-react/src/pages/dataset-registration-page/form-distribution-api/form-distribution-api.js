import { compose } from 'recompose';
import { FormDistributionApiPure } from './form-distribution-api-pure';
import { formDistributionApiResolver } from './form-distribution-api-resolver';
import { formConfigurer } from './form-configurer';
import { propsEnhancer } from './props-enhancer';

const enhance = compose(
  propsEnhancer,
  formConfigurer,
  formDistributionApiResolver
);

export const FormDistributionApi = enhance(FormDistributionApiPure);
