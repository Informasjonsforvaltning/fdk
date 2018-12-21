import React from 'react';
import { shallow } from 'enzyme';
import { App } from './app';

let defaultProps;
let setSearchQuery;

beforeEach(() => {
  setSearchQuery = jest.fn();
  defaultProps = {
    language: 'nb',
    datasetTotal: 1,
    apiTotal: 1,
    conceptTotal: 1,
    searchQuery: { q: 'tester' },
    setSearchQuery
  };
});

test('should render App correctly', () => {
  const wrapper = shallow(<App {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
