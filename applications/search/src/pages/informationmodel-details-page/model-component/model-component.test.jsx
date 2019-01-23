import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ModelComponentPure } from './model-component.component';
import informationModelApiResponse from '../../../mock/informationmodelApiResponse.json';

test('should render ModelComponentPure correctly with no props', () => {
  const wrapperWithNoProps = shallow(<ModelComponentPure />);
  expect(wrapperWithNoProps).toMatchSnapshot();
});

test('should render ModelComponentPure with props', () => {
  const defaultProps = {
    name: 'Eiendom',
    definitions: _.get(informationModelApiResponse, ['schema', 'definitions'])
  };
  const wrapper = shallow(<ModelComponentPure {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
