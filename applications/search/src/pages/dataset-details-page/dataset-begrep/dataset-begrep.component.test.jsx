import React from 'react';
import { shallow } from 'enzyme';
import { DatasetBegrep } from './dataset-begrep.component';
import datasets from '../../../../test/fixtures/datasets';

test('should render DatasetBegrep correctly with no props', () => {
  const minWrapper = shallow(<DatasetBegrep />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render DatasetBegrep correctly', () => {
  const { _source } = datasets[0];
  const defaultProps = {
    subject: _source.subject,
    keyword: _source.keyword
  };
  const wrapper = shallow(<DatasetBegrep {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetBegrep correctly with no subject definition', () => {
  const { _source } = datasets[1];
  const defaultProps = {
    subject: _source.subject,
    keyword: _source.keyword
  };
  const wrapper = shallow(<DatasetBegrep {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
