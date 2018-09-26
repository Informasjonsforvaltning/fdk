import React from 'react';
import { shallow } from 'enzyme';
import { Catalog } from './catalogs.component';

let defaultProps;
let wrapper;
let fetchItems;
let items;

beforeEach(() => {
  fetchItems = jest.fn();
  items = {
    '910244132': {
      items: {
        _embedded: {
          datasets: [
            {
              id: 'aab2063b-adf4-483a-a342-9e75c9a7c948'
            }
          ]
        }
      }
    }
  };
  defaultProps = {
    catalogId: '910244132',
    type: 'datasets',
    fetchItems
  };
  wrapper = shallow(<Catalog {...defaultProps} />);
});

test('should render Catalog correctly with minimum props', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render Catalog correctly with one dataset item', () => {
  wrapper.setProps({
    items
  });
  expect(wrapper).toMatchSnapshot();
});
