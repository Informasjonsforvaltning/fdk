import React from 'react';
import { shallow } from 'enzyme';
import InformationModel from './information-model.component';

test('should render InformationModel correctly', () => {
  expect(shallow(<InformationModel />)).toMatchSnapshot();
});
