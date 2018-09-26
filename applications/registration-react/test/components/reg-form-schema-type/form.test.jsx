import React from 'react';
import { shallow } from 'enzyme';
import FormType from '../../../src/components/reg-form-schema-type/form';
import helptext from '../../fixtures/helptext';

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
