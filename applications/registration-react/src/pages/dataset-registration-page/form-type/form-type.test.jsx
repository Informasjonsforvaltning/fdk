import React from 'react';
import { shallow } from 'enzyme';
import { FormType } from './form-type.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    syncErrors: {
      errorType: true
    }
  };
  wrapper = shallow(<FormType {...defaultProps} />);
});

test('should render FormType, { renderLandingpage  correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
