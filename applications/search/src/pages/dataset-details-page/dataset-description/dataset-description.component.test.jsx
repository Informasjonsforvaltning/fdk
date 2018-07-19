import React from 'react';
import { shallow } from 'enzyme';
import { DatasetDescription } from './dataset-description.component';
import datasets from '../../../../test/fixtures/datasets';

test('should render DatasetDescription correctly with no props', () => {
  const minWrapper = shallow(<DatasetDescription />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render DatasetDescription correctly', () => {
  const { _source } = datasets[0];
  const defaultProps = {
    title: _source.title.nb,
    description: _source.description.nb,
    objective: _source.objective.nb,
    publisher: _source.publisher,
    themes: _source.theme,
    harvest: _source.harvest
  };
  const wrapper = shallow(<DatasetDescription {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetDescription correctly', () => {
  const { _source } = datasets[1];
  const defaultProps = {
    title: _source.title.nb,
    description: _source.description.nb,
    objective: _source.objective.nb,
    publisher: _source.publisher,
    themes: _source.theme,
    harvest: _source.harvest
  };
  const wrapper = shallow(<DatasetDescription {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
