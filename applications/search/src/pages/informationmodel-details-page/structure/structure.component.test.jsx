import React from 'react';
import { shallow } from 'enzyme';
import { Structure } from './structure.component';
import informationModelApiResponse from '../../../mock/informationmodel.response.json';

const schema = JSON.parse(informationModelApiResponse.schema);

test('should render Structure success correctly with props', () => {
  const wrapper = shallow(<Structure definitions={schema.definitions} />);
  expect(wrapper).toMatchSnapshot();
});
