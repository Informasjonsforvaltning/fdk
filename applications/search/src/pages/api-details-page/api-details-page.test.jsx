import React from 'react';
import { shallow } from 'enzyme';
import { ApiDetailsPage } from './api-details-page';
import apiItemComplete from '../../mock/api.response.json';
import { apiItemMissingFields } from './__fixtures/apiItemMissingFields';

test('should render ApiDetailsPage correctly with no apiItem', () => {
  const wrapper = shallow(<ApiDetailsPage />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ApiDetailsPage correctly with apiItem', () => {
  const wrapper = shallow(
    <ApiDetailsPage apiItem={apiItemComplete} isFetchingDataset={false} />
  );
  expect(wrapper).toMatchSnapshot();
});

test('should render ApiDetailsPage correctly with missing api-properties', () => {
  const wrapper = shallow(
    <ApiDetailsPage apiItem={apiItemMissingFields} isFetchingDataset={false} />
  );
  expect(wrapper).toMatchSnapshot();
});
