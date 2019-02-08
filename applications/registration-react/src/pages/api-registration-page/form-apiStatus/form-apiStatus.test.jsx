import React from 'react';
import { shallow } from 'enzyme';
import { FormApiStatus } from './form-apiStatus.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {};
  wrapper = shallow(<FormApiStatus {...defaultProps} />);
});

test('should render FormApiStatus, { renderLandingpage  correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
