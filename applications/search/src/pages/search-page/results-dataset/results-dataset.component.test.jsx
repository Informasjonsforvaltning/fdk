import React from 'react';
import { shallow } from 'enzyme';
import {
  ResultsDatasetPure,
  showEUThemeFilter
} from './results-dataset.component';
import datasetsResponse from '../__fixtures/datasetsApiResponse.json';
import {
  extractAggregations,
  extractDatasets,
  extractTotal
} from '../../../api/datasets';

test('should render ResultsDataset correctly with minimum of props', () => {
  const result = shallow(<ResultsDatasetPure />);
  expect(result).toMatchSnapshot();
});

test('should render ResultsDataset correctly with hits', () => {
  const props = {
    datasetItems: extractDatasets(datasetsResponse),
    datasetAggregations: extractAggregations(datasetsResponse),
    datasetTotal: extractTotal(datasetsResponse)
  };
  const result = shallow(<ResultsDatasetPure {...props} />);
  expect(result).toMatchSnapshot();
});

test('should not show filter EU-theme if only one theme type which is "Ukjent"', () => {
  const buckets = [
    {
      key: 'Ukjent'
    }
  ];
  expect(showEUThemeFilter({ buckets })).toBe(false);
});

test('should show filter EU-theme if contains theme and at least one of them are not of type "Ukjent"', () => {
  const bucketsWithNoUkjent = [
    {
      key: 'TRAN'
    }
  ];
  expect(showEUThemeFilter({ buckets: bucketsWithNoUkjent })).toBe(true);

  const bucketsWithOneUkjent = [
    {
      key: 'Ukjent'
    },
    {
      key: 'TRAN'
    }
  ];
  expect(showEUThemeFilter({ buckets: bucketsWithOneUkjent })).toBe(true);
});
