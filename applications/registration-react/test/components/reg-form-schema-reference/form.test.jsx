import React from 'react';
import { shallow } from 'enzyme';
import FormReference, {
  renderReference
} from '../../../src/components/reg-form-schema-reference/form';
import helptext from '../../fixtures/helptext';

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
