import React from 'react';
import { shallow } from 'enzyme';
import FormDistribution, {
  renderDistributions,
  renderDistributionLandingpage
} from '../../../src/components/reg-form-schema-distribution/form';
import { distributionTypes } from '../../../src/components/reg-form-schema-distribution/index';
import helptext from '../../fixtures/helptext';
import openlicenses from '../../fixtures/openlicenses';
import distribution from '../../fixtures/distributions';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  const { openLicenseItems } = openlicenses;
  defaultProps = {
    initialValues: {
      distribution: distributionTypes(distribution),
      openLicenseItems
    },
    helptextItems
  };
  wrapper = shallow(<FormDistribution {...defaultProps} />);
});

test('should render FormDistribution correctly', () => {
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
