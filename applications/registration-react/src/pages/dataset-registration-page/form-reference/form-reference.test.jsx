import React from 'react';
import { shallow } from 'enzyme';
import FormReference, { renderReference } from './form-reference.component';
import helptext from '../../../../test/fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    initialValues: {},
    helptextItems
  };
  wrapper = shallow(<FormReference {...defaultProps} />);
});

test('should render FormReference correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderReference correctly', () => {
  wrapper = shallow(renderReference(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
