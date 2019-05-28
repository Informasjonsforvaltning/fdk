import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ApiRegistrationPagePure } from './api-registration-page-pure';
import apisResponse from '../../mock/apis.response.json';

const item = _.find(apisResponse._embedded.apiRegistrations, {
  id: '3ad7ec56-4fb8-471a-8931-7ba0640d42a4'
});

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    item
  };
  wrapper = shallow(<ApiRegistrationPagePure {...defaultProps} />);
});

test('should render ApiRegistrationPagePure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
