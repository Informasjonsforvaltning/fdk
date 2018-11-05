import React from 'react';
import { shallow } from 'enzyme';
import { FormSample, renderSamples } from './form-sample.component';
import { sampleTypes } from './connected-form-sample.component';
import helptext from '../../../../test/fixtures/helptext';
import openlicenses from '../../../../test/fixtures/openlicenses';
import samples from '../../../../test/fixtures/samples';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  const { openLicenseItems } = openlicenses;
  defaultProps = {
    initialValues: {
      sample: sampleTypes(samples),
      openLicenseItems
    },
    helptextItems
  };
  wrapper = shallow(<FormSample {...defaultProps} />);
});

test('should render FormSample correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderSamples correctly', () => {
  wrapper = shallow(renderSamples(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
