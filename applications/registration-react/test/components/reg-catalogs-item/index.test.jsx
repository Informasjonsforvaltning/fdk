import React from 'react';
import { shallow } from 'enzyme';
import CatalogItem from '../../../src/components/reg-catalogs-item';
import catalogs from '../../fixtures/catalogs';

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
