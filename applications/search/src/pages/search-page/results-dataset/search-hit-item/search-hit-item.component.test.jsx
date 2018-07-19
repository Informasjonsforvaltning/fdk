import React from 'react';
import { shallow } from 'enzyme';
import { SearchHitItem } from './search-hit-item.component';
import datasets from '../../../../../test/fixtures/datasets';
import distributionTypes from '../../../../../test/fixtures/distributionTypes';

let defaultProps;

test('should render SearchHitItem NON_PUBLIC correctly', () => {
  defaultProps = {
    result: datasets[0]
  };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render SearchHitItem RESTRICTED correctly', () => {
  defaultProps = {
    result: datasets[1]
  };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render SearchHitItem PUBLIC correctly', () => {
  defaultProps = {
    result: datasets[2]
  };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render SearchHitItem with no title, description, accessRights and distribution with no format correctly', () => {
  defaultProps = {
    result: datasets[3]
  };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render SearchHitItem with distribution type correctly', () => {
  defaultProps = {
    result: datasets[5],
    distributionTypeItems: distributionTypes.distributionTypeItems
  };
  const wrapper = shallow(<SearchHitItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
