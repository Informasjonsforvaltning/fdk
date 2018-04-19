import React from 'react';
import { shallow } from 'enzyme';
import DatasetDistribution from '../../../src/components/search-dataset-distribution';
import datasets from '../../fixtures/datasets';
import openLicenses from '../../fixtures/openLicenses';

test('should render DatasetDistribution correctly with no props', () => {
  const minWrapper = shallow(<DatasetDistribution />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render DatasetDistribution correctly', () => {
  const { _source } = datasets[0];
  const defaultProps = {
    title: _source.title.nb,
    description: _source.description.nb,
    accessUrl: _source.distribution[0].accessURL,
    format: _source.distribution[0].format,
    code: _source.distribution[0].code,
    license: _source.distribution[0].license,
    conformsTo: _source.conformsTo,
    page: _source.page,
    selectedLanguageCode: null
  };
  const wrapper = shallow(<DatasetDistribution {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetDistribution correctly with distribution with Open License', () => {
  const { _source } = datasets[0];
  const defaultProps = {
    title: _source.title.nb,
    description: _source.description.nb,
    accessUrl: _source.distribution[1].accessURL,
    format: _source.distribution[1].format,
    code: _source.distribution[1].code,
    license: _source.distribution[1].license,
    conformsTo: _source.conformsTo,
    page: _source.page,
    selectedLanguageCode: null
  };
  const wrapper = shallow(<DatasetDistribution {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetDistribution correctly', () => {
  const { _source } = datasets[1];
  const defaultProps = {
    title: _source.title.nb,
    description: _source.description.nb,
    accessUrl: _source.distribution[0].accessURL,
    format: _source.distribution[0].format,
    code: _source.distribution[0].code,
    license: _source.distribution[0].license,
    conformsTo: _source.conformsTo,
    page: _source.page,
    openLicenseItems: openLicenses,
    selectedLanguageCode: null
  };
  const wrapper = shallow(<DatasetDistribution {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

