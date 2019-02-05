import React from 'react';
import { shallow } from 'enzyme';
import { InformationModelReference } from './informationmodel-reference.component';
import informationModelItem from './__fixtures/informationmodelItem.json';

let defaultProps;

test('should render InformationModelReference correctly with no props', () => {
  const wrapper = shallow(<InformationModelReference />);
  expect(wrapper).toMatchSnapshot();
});

test('should render InformationModelReference correctly', () => {
  defaultProps = {
    informationModelReference: informationModelItem,
    index: 0
  };
  const wrapper = shallow(<InformationModelReference {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
