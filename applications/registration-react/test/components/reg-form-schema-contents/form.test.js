import React from 'react';
import { shallow } from 'enzyme';
import FormContentsComponent, { renderStandard, renderStandardFields } from '../../../src/components/reg-form-schema-contents/form';
import helptext from '../../fixtures/helptext';

let defaultProps, wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    helptextItems: helptextItems,
  };
  wrapper = shallow(<FormContentsComponent {...defaultProps} />);
});


test('should render FormContentsComponent, { renderS correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderStandard correctly', () => {
  wrapper = shallow(renderStandard(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
