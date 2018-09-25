import React from 'react';
import { shallow } from 'enzyme';
import FormContactPoint from './form-contactPoint.component';
import helptext from '../../../../test/fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    helptextItems
  };
  wrapper = shallow(<FormContactPoint {...defaultProps} />);
});

test('should render FormContactPoint correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
