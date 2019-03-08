import React from 'react';
import { shallow } from 'enzyme';
import { HitsStats } from './hits-stats.component';

test('should render HitsStats correctly when no initial search', () => {
  const defaultProps = {
    countDatasets: 100,
    countTerms: 100,
    filteringOrTextSearchPerformed: false
  };
  const wrapper = shallow(<HitsStats {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render HitsStats correctly when search performed ', () => {
  const defaultProps = {
    countDatasets: 100,
    countTerms: 100,
    filteringOrTextSearchPerformed: true
  };
  const wrapper = shallow(<HitsStats {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render HitsStats correctly when no hits', () => {
  const defaultProps = {
    countDatasets: 0,
    countTerms: 0,
    filteringOrTextSearchPerformed: true
  };
  const wrapper = shallow(<HitsStats {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
