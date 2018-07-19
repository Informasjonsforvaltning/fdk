import React from 'react';
import { shallow } from 'enzyme';
import { DatasetInfo } from './dataset-info.component';
import datasets from '../../../../test/fixtures/datasets';

test('should render DatasetInfo correctly with no props', () => {
  const minWrapper = shallow(<DatasetInfo />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render DatasetInfo correctly', () => {
  const { _source } = datasets[0];
  const defaultProps = {
    issued: _source.issued,
    accrualPeriodicity: _source.accrualPeriodicity.prefLabel.nb,
    provenance: _source.provenance.prefLabel.nb,
    hasCurrentnessAnnotation: _source.hasCurrentnessAnnotation.hasBody.no,
    spatial: _source.spatial,
    temporal: _source.temporal,
    language: _source.language,
    references: _source.references
  };
  const wrapper = shallow(<DatasetInfo {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render DatasetInfo correctly', () => {
  const { _source } = datasets[1];
  const defaultProps = {
    issued: _source.issued,
    accrualPeriodicity: _source.accrualPeriodicity.prefLabel.nb,
    provenance: _source.provenance.prefLabel.nb,
    hasCurrentnessAnnotation: _source.hasCurrentnessAnnotation.hasBody.no,
    spatial: _source.spatial,
    temporal: _source.temporal,
    language: _source.language,
    references: _source.references
  };
  const wrapper = shallow(<DatasetInfo {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
