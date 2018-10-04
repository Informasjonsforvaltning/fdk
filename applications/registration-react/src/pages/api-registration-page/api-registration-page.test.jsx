import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { APIRegistrationPage } from './api-registration-page';
import api from './__fixtures/api.json';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    item: _.get(api, ['910244132', 'item', 0])
  };
  wrapper = shallow(<APIRegistrationPage {...defaultProps} />);
});

test('should render APIRegistrationPage correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
