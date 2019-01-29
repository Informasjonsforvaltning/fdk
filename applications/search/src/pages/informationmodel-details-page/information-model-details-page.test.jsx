import React from 'react';
import { shallow } from 'enzyme';
import { InformationModelDetailsPage } from './information-model-details-page';
import informationModelApiResponse from '../../mock/informationmodel.response.json';

let wrapper;

beforeEach(() => {
  const fetchPublishersIfNeeded = jest.fn();

  const defaultProps = {
    showFilterModal: true,
    informationModelItem: informationModelApiResponse,
    fetchPublishersIfNeeded
  };
  wrapper = shallow(<InformationModelDetailsPage {...defaultProps} />);
});

test('should render InformationModelDetailsPage correctly with no informationModelItem', () => {
  const wrapperWithNoProps = shallow(<InformationModelDetailsPage />);
  expect(wrapperWithNoProps).toMatchSnapshot();
});

test('should render InformationModelDetailsPage correctly with informationModelItem', () => {
  expect(wrapper).toMatchSnapshot();
});
