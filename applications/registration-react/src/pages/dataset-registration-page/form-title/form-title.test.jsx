import React from 'react';
import { shallow } from 'enzyme';
import FormTitle from './form-title.component';
import helptext from '../../../../test/fixtures/helptext';

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
