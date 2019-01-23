import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { Structure } from './structure.component';
import informationModelApiResponse from '../../../mock/informationmodelApiResponse.json';

test('should render Structure success correctly with props', () => {
  const wrapper = shallow(
    <Structure
      definitions={_.get(informationModelApiResponse, [
        'schema',
        'definitions'
      ])}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
