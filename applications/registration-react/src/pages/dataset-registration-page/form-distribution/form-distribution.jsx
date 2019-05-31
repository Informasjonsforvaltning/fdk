import { compose } from 'recompose';

import { formConfigurer } from './form-configurer';
import { FormDistributionPure } from './form-distribution-pure';
import { setInitialValues } from './set-initial-values';

const enhance = compose(
  setInitialValues,
  formConfigurer
);

export const FormDistribution = enhance(FormDistributionPure);
