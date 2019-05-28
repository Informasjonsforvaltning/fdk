import React from 'react';
import { shallow } from 'enzyme';
import { FormTitle } from './form-title.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {};
  wrapper = shallow(<FormTitle {...defaultProps} />);
});

test('should render FormTitle, { renderLandingpage  correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
