import React from 'react';
import { shallow } from 'enzyme';
import { DatasetLandingPage } from './dataset-landing-page.component';

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
