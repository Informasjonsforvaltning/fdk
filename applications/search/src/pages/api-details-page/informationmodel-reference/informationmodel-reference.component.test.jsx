import React from 'react';
import { shallow } from 'enzyme';
import { InformationModelReference } from './informationmodel-reference.component';
import informationModelsResponse from '../../../mock/informationmodels.response.json';

const informationModelItem =
  informationModelsResponse._embedded.informationmodels[0];

test('should render InformationModelReference correctly with no props', () => {
  const wrapper = shallow(<InformationModelReference />);
  expect(wrapper).toMatchSnapshot();
});

test('should render InformationModelReference correctly', () => {
  const props = {
    informationModelReference: informationModelItem,
    index: 0
  };
  const wrapper = shallow(<InformationModelReference {...props} />);
  expect(wrapper).toMatchSnapshot();
});
