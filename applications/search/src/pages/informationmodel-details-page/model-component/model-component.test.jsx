import React from 'react';
import { shallow } from 'enzyme';
import { ModelComponentPure } from './model-component.component';
import informationModelApiResponse from '../../../mock/informationmodel.response.json';

const schema = JSON.parse(informationModelApiResponse.schema);

test('should render ModelComponentPure correctly with no props', () => {
  const wrapperWithNoProps = shallow(<ModelComponentPure />);
  expect(wrapperWithNoProps).toMatchSnapshot();
});

test('should render ModelComponentPure with props', () => {
  const defaultProps = {
    name: 'Enhet',
    definitions: schema.definitions
  };
  const wrapper = shallow(<ModelComponentPure {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
