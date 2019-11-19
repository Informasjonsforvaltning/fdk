import React from 'react';
import { shallow } from 'enzyme';
import { CatalogsPagePure } from './catalogs-page-pure';
import catalogs from '../../../test/fixtures/catalogs';

let defaultProps;
let wrapper;
let dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    catalogItems: catalogs.catalogItems,
    isFetchingCatalogs: false
  };
  wrapper = shallow(<CatalogsPagePure {...defaultProps} />);
});

test('should render CatalogsPagePure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
