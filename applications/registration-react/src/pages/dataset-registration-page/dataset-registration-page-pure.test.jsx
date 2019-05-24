import React from 'react';
import { shallow } from 'enzyme';
import { DatasetRegistrationPagePure } from './dataset-registration-page-pure';
import helptexts from '../../../test/fixtures/helptext';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  const fetchDatasetsIfNeeded = jest.fn();
  const fetchProvenanceIfNeeded = jest.fn();
  const fetchFrequencyIfNeeded = jest.fn();
  const fetchThemesIfNeeded = jest.fn();
  const fetchReferenceTypesIfNeeded = jest.fn();
  const fetchReferenceDatasetsIfNeeded = jest.fn();
  const fetchOpenLicensesIfNeeded = jest.fn();
  const fetchHelptextsIfNeeded = jest.fn();
  defaultProps = {
    dispatch,
    fetchDatasetsIfNeeded,
    fetchProvenanceIfNeeded,
    fetchFrequencyIfNeeded,
    fetchThemesIfNeeded,
    fetchReferenceTypesIfNeeded,
    fetchReferenceDatasetsIfNeeded,
    fetchOpenLicensesIfNeeded,
    fetchHelptextsIfNeeded,
    helptextItems: helptexts.helptextItems,
    isFetching: false
  };
  wrapper = shallow(<DatasetRegistrationPagePure {...defaultProps} />);
});

test('should render DatasetRegistrationPagePure correctly', () => {
  expect(wrapper).toHaveLength(1);
  expect(wrapper).toMatchSnapshot();
});
