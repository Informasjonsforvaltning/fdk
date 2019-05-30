import React from 'react';
import { shallow } from 'enzyme';
import {
  FormDistributionPure,
  renderDistributions,
  renderDistributionLandingpage
} from './form-distribution-pure';
import { distributionTypes } from './form-distribution';
import openlicenses from '../../../../test/fixtures/openlicenses';
import distribution from '../../../../test/fixtures/distributions';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { openLicenseItems } = openlicenses;
  defaultProps = {
    initialValues: {
      distribution: distributionTypes(distribution),
      openLicenseItems
    }
  };
  wrapper = shallow(<FormDistributionPure {...defaultProps} />);
});

test('should render FormDistributionPure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderDistributions correctly', () => {
  wrapper = shallow(renderDistributions(defaultProps));
  expect(wrapper).toMatchSnapshot();
});

test('should render renderDistributionLandingpage correctly', () => {
  wrapper = shallow(renderDistributionLandingpage(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
