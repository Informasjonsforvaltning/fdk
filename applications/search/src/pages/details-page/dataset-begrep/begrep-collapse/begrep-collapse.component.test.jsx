import React from 'react';
import { shallow } from 'enzyme';
import { BegrepCollapse } from './begrep-collapse.component';
import datasets from '../../../../../test/fixtures/datasets';

test('should render BegrepCollapse correctly with no props', () => {
  const minWrapper = shallow(<BegrepCollapse />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render BegrepCollapse correctly', () => {
  const { _source } = datasets[0];
  const defaultProps = {
    prefLabel: _source.subject[0].prefLabel.no,
    definition: _source.subject[0].definition.no,
    note: _source.subject[0].note.no
  };
  const wrapper = shallow(<BegrepCollapse {...defaultProps} />);
  wrapper.find('div.fdk-container-begrep').simulate('click');
  expect(wrapper.state('detailed')).toBe(true);
  expect(wrapper).toMatchSnapshot();
});
