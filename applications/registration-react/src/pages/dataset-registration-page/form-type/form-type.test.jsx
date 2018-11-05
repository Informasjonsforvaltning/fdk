import React from 'react';
import { shallow } from 'enzyme';
import { FormType } from './form-type.component';
import helptext from '../../../../test/fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    syncErrors: {
      errorType: true
    },
    helptextItems
  };
  wrapper = shallow(<FormType {...defaultProps} />);
});

test('should render FormType, { renderLandingpage  correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
