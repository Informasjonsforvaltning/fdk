import _ from 'lodash';
import React from 'react';
import { shallow } from 'enzyme';
import {
  FormSpatial,
  renderTemporal,
  renderTemporalFields
} from './form-spatial.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {};
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
  wrapper = shallow(renderTemporal({ item: {} }));
  expect(wrapper).toMatchSnapshot();
});

test('should render renderTemporalFields correctly', () => {
  const temporal = [{}];
  wrapper = shallow(
    renderTemporalFields({
      item: temporal,
      index: 0,
      fields: null,
      onDeleteFieldAtIndex: _.noop
    })
  );
  expect(wrapper).toMatchSnapshot();
});
