import React from 'react';
import { shallow } from 'enzyme';
import { CustomHitsStats } from './custom-hits-stats.component';

test('should render CustomHitsStats correctly when no initial search', () => {
  const defaultProps = {
    countDatasets: 100,
    countTerms: 100,
    filteringOrTextSearchPerformed: false
  };
  const wrapper = shallow(<CustomHitsStats {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render CustomHitsStats correctly when search performed ', () => {
  const defaultProps = {
    countDatasets: 100,
    countTerms: 100,
    filteringOrTextSearchPerformed: true
  };
  const wrapper = shallow(<CustomHitsStats {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render CustomHitsStats correctly when no hits', () => {
  const defaultProps = {
    countDatasets: 0,
    countTerms: 0,
    filteringOrTextSearchPerformed: true
  };
  const wrapper = shallow(<CustomHitsStats {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
