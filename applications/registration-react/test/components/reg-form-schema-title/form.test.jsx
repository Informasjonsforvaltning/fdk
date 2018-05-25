import React from 'react';
import { shallow } from 'enzyme';
import FormTitle from '../../../src/components/reg-form-schema-title/form';
import helptext from '../../fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    helptextItems
  };
  wrapper = shallow(<FormTitle {...defaultProps} />);
});

test('should render FormTitle, { renderLandingpage  correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
