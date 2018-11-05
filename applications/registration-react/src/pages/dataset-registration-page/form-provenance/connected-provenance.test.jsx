import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormProvenance } from './connected-form-provenance.component';
import dataset from '../../../../test/fixtures/datasets';
import frequency from '../../../../test/fixtures/frequency';
import provenance from '../../../../test/fixtures/provenance';

test('should render ConnectedFormProvenance correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  const { frequencyItems } = frequency;
  const { provenanceItems } = provenance;
  const wrapper = shallowWithStore(
    <ConnectedFormProvenance
      datasetItem={datasetItem}
      frequencyItems={frequencyItems}
      provenanceItems={provenanceItems}
    />,
    store
  );
  expect(wrapper).toHaveLength(1);
});
