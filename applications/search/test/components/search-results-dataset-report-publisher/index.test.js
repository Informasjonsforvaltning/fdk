import React from 'react';
import { shallow } from 'enzyme';
import SearchPublishers from '../../../src/components/search-results-dataset-report-publisher';
import aggregateDataset from '../../fixtures/aggregateDataset';

let onSearch, defaultProps, wrapper;

beforeEach(() => {
  onSearch = jest.fn();
  defaultProps = {
    onSearch: onSearch,
    value: 'STAT'
  };
  wrapper = shallow(<SearchPublishers {...defaultProps} />);
});

test('should render SearchPublishers correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});

