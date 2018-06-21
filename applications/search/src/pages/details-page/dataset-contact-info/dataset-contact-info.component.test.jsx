import React from 'react';
import { shallow } from 'enzyme';
import { DatasetContactInfo } from './dataset-contact-info.component';
import datasets from '../../../../test/fixtures/datasets';

test('should render DatasetContactInfo correctly with no props', () => {
  const minWrapper = shallow(<DatasetContactInfo />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render DatasetContactInfo correctly', () => {
  const { _source } = datasets[0];
  const defaultProps = {
    contactPoint: _source.contactPoint[0]
  };
  const wrapper = shallow(<DatasetContactInfo {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetContactInfo correctly', () => {
  const wrapper = shallow(<DatasetContactInfo />);
  expect(wrapper).toMatchSnapshot();
});
