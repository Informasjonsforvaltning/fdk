import React from 'react';
import { shallow } from 'enzyme';
import {
  FormContentsComponent,
  renderStandard
} from './form-contents.component';
import helptext from '../../../../test/fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    helptextItems
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
