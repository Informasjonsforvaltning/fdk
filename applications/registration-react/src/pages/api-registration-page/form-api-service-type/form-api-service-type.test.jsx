import React from 'react';
import { shallow } from 'enzyme';
import { FormApiServiceType } from './form-api-service-type.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {};
  wrapper = shallow(<FormApiServiceType {...defaultProps} />);
});

test('should render FormApiServiceType, { renderLandingpage  correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
