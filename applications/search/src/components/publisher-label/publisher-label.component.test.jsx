import React from 'react';
import { shallow } from 'enzyme';
import { PublisherLabel } from './publisher-label.component';
import { publisherWithPrefLabel } from './__fixtures/publisherWithPrefLabel';
import { publisherWithNoPrefLabel } from './__fixtures/publisherWithNoPrefLabel';

test('should render PublisherLabel with publisher', () => {
  const defaultProps = {
    label: 'Eies av',
    publisherItem: publisherWithPrefLabel
  };
  const wrapper = shallow(<PublisherLabel {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render PublisherLabel with no props', () => {
  const wrapper = shallow(<PublisherLabel />);
  expect(wrapper).toMatchSnapshot();
});

test('should render PublisherLabel with no prefLabel', () => {
  const defaultProps = {
    label: 'Eies av',
    publisherItem: publisherWithNoPrefLabel
  };
  const wrapper = shallow(<PublisherLabel {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
