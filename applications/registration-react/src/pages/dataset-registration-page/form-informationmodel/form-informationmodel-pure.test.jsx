import React from 'react';
import { shallow } from 'enzyme';
import {
  FormInformationModelPure,
  renderInformationModel
} from './form-informationmodel-pure.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {};
  wrapper = shallow(<FormInformationModelPure {...defaultProps} />);
});

test('should render FormInformationModelPure, { renderS correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderInformationModel correctly', () => {
  wrapper = shallow(renderInformationModel(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
