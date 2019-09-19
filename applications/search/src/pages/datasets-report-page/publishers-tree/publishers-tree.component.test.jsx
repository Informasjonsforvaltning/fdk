import React from 'react';
import { shallow } from 'enzyme';
import { PublishersTreePure } from './publishers-tree.component';
import publishers from '../../../../test/fixtures/publisherHierarchy';

let onSearch;
let defaultProps;
let wrapper;

beforeEach(() => {
  onSearch = jest.fn();

  defaultProps = {
    onSearch,
    orgPath: '/STAT/872417842/960885406',
    publishers
  };
  wrapper = shallow(<PublishersTreePure {...defaultProps} />);
});

test('should render PublishersTreePure correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});
