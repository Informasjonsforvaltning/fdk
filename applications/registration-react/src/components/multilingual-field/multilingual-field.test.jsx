import React from 'react';
import { shallow } from 'enzyme';
import MultilingualField from './multilingual-field.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    name: null,
    label: null,
    component: null,
    languages: []
  };
  wrapper = shallow(<MultilingualField {...defaultProps} />);
});

test('should render MultilingualField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
