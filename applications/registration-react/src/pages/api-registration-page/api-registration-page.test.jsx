import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { APIRegistrationPage } from './api-registration-page';
import apisResponse from '../../mock/apis.response.json';

const item = _.find(apisResponse._embedded.apiRegistrations, {
  id: '3ad7ec56-4fb8-471a-8931-7ba0640d42a4'
});

let defaultProps;
let wrapper;

beforeEach(() => {
  const fetchHelptextsIfNeeded = jest.fn();
  const fetchCatalogIfNeeded = jest.fn();
  defaultProps = {
    item,
    fetchHelptextsIfNeeded,
    fetchCatalogIfNeeded
  };
  wrapper = shallow(<APIRegistrationPage {...defaultProps} />);
});

test('should render APIRegistrationPage correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
