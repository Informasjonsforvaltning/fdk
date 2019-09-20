import React from 'react';
import { shallow } from 'enzyme';
import { PublishersSelect } from './publishers-select.component';

let onSearch;
let defaultProps;
let wrapper;

beforeEach(() => {
  onSearch = jest.fn();
  defaultProps = {
    publishers: {},
    onSearch,
    value: { orgPath: 'STAT' }
  };
  wrapper = shallow(<PublishersSelect {...defaultProps} />);
});

test('should render PublishersSelect correctly with props', () => {
  expect(wrapper).toMatchSnapshot();
});
