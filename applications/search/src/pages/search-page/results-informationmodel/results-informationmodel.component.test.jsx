import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { ResultsInformationModelPure } from './results-informationmodel.component';
import informationModelApiResponse from '../__fixtures/informationmodelsApiResponse.json';
import { HITS_PER_PAGE } from '../../../constants/constants';

let closeFilterModal;
let onFilterTheme;
let onFilterAccessRights;
let onFilterPublisherHierarchy;
let onClearFilters;
let setInformationModelSort;
let onSortByLastModified;
let onSortByScore;
let onPageChange;
let defaultProps;
let wrapper;

beforeEach(() => {
  closeFilterModal = jest.fn();
  onFilterTheme = jest.fn();
  onFilterAccessRights = jest.fn();
  onFilterPublisherHierarchy = jest.fn();
  onClearFilters = jest.fn();
  setInformationModelSort = jest.fn();
  onSortByLastModified = jest.fn();
  onSortByScore = jest.fn();
  onPageChange = jest.fn();

  defaultProps = {
    showFilterModal: true,
    informationModelItems: {},
    searchQuery: {},
    themesItems: {},
    publisherArray: [],
    publishers: {},
    showClearFilterButton: false,
    hitsPerPage: HITS_PER_PAGE,
    closeFilterModal,
    onFilterTheme,
    onFilterAccessRights,
    onFilterPublisherHierarchy,
    onClearFilters,
    setInformationModelSort,
    onSortByLastModified,
    onSortByScore,
    onPageChange
  };
  wrapper = shallow(<ResultsInformationModelPure {...defaultProps} />);
});

test('should render ResultsInformationModel correctly with minimum of props and no hits', () => {
  const minWrapper = shallow(
    <ResultsInformationModelPure
      setInformationModelSort={setInformationModelSort}
      onSortByLastModified={onSortByLastModified}
      onSortByScore={onSortByScore}
    />
  );
  expect(minWrapper).toMatchSnapshot();
});

test('should render ResultsInformationModel correctly with hits', () => {
  wrapper.setProps({
    informationModelItems: _.get(informationModelApiResponse, 'hits'),
    informationModelAggregations: _.get(
      informationModelApiResponse,
      'aggregations'
    ),
    informationModelTotal: _.get(informationModelApiResponse, 'total')
  });
  expect(wrapper).toMatchSnapshot();
});
