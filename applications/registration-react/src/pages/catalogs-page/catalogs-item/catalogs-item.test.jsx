import React from 'react';
import { shallow } from 'enzyme';
import CatalogItem from './catalogs-item.component';
import catalogs from '../../../../test/fixtures/catalogs';

let defaultProps;
let wrapper;

beforeEach(() => {
  const item = catalogs.catalogItems._embedded.catalogs[0];
  defaultProps = {
    item
  };
  wrapper = shallow(<CatalogItem {...defaultProps} />);
});

test('should render CatalogItem correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
