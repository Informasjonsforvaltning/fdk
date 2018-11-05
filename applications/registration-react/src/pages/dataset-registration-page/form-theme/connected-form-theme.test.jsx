import React from 'react';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../../../test/shallowWithStore';
import { ConnectedFormThemes } from './connected-form-theme.component';
import dataset from '../../../../test/fixtures/datasets';
import themes from '../../../../test/fixtures/themes';

test('should render ConnectedFormThemes correctly', () => {
  const testState = {};
  const store = createMockStore(testState);
  const datasetItem = dataset.datasetItems._embedded.datasets[0];
  const themesItems = themes;
  const wrapper = shallowWithStore(
    <ConnectedFormThemes
      datasetItems={datasetItem}
      themesItems={themesItems}
    />,
    store
  );
  expect(wrapper).toHaveLength(1);
});
