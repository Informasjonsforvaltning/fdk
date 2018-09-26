import React from 'react';
import { shallow } from 'enzyme';
import FormSample, {
  renderSamples
} from '../../../src/components/reg-form-schema-sample/form';
import { sampleTypes } from '../../../src/components/reg-form-schema-sample/index';
import helptext from '../../fixtures/helptext';
import openlicenses from '../../fixtures/openlicenses';
import samples from '../../fixtures/samples';

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
