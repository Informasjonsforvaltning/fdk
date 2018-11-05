import React from 'react';
import { shallow } from 'enzyme';
import {
  FormSpatial,
  renderTemporal,
  renderTemporalFields
} from './form-spatial.component';
import helptext from '../../../../test/fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    helptextItems
  };
  wrapper = shallow(<FormSpatial {...defaultProps} />);
});

test('should render FormSpatial correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FormSpatial correctly with initialValues', () => {
  wrapper.setProps({
    initialValues: {
      spatial: [
        {
          uri: 'Oslo',
          prefLabel: {}
        }
      ],
      temporal: [
        {
          startDate: null,
          endDate: null
        }
      ],
      issued: null,
      language: []
    }
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render renderTemporal correctly', () => {
  wrapper = shallow(renderTemporal(defaultProps));
  expect(wrapper).toMatchSnapshot();
});

test('should render renderTemporalFields correctly', () => {
  const temporal = [{}];
  wrapper = shallow(renderTemporalFields(temporal, 0, null, defaultProps));
  expect(wrapper).toMatchSnapshot();
});
