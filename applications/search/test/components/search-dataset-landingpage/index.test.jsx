import React from 'react';
import { shallow } from 'enzyme';
import DatasetLandingPage from '../../../src/components/search-dataset-landingpage';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    landingPage: 'landingpage'
  };
  wrapper = shallow(<DatasetLandingPage {...defaultProps} />);
});

test('should render DatasetLandingPage correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
