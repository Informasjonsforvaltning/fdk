import validate from '../../../src/components/reg-form-schema-spatial/formValidations';
import datasets from '../../fixtures/datasets';

it('should validate without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(validate(dataset)).toEqual({});
});
