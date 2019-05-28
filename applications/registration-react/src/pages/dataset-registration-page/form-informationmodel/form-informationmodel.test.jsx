import React from 'react';
import { shallow } from 'enzyme';
import {
  FormInformationModel,
  renderInformationModel
} from './form-informationmodel.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {};
  wrapper = shallow(<FormInformationModel {...defaultProps} />);
});

test('should render FormInformationModel, { renderS correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderInformationModel correctly', () => {
  wrapper = shallow(renderInformationModel(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
