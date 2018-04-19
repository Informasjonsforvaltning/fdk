import React from 'react';
import { shallow } from 'enzyme';
import { SearchPage } from '../../../src/containers/search-results';
import datasets from '../../fixtures/datasets';

let defaultProps, wrapper;

beforeEach(() => {
  defaultProps = {
    location: {"pathname":"/","search":"","hash":"","key":"lj1xo0"}
  };
  wrapper = shallow(
    <SearchPage
      {...defaultProps}
    />
  )
});

test('should render SearchPage correctly with no datasetItems', () => {
  expect(wrapper).toMatchSnapshot();
})



