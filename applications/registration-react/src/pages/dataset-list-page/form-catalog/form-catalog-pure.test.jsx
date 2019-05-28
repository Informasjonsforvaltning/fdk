import React from 'react';
import { shallow } from 'enzyme';
import { FormCatalogPure } from './form-catalog-pure';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    initialValues: {
      title: 'Title',
      publisher: 'Publisher'
    },
    values: {
      description: {
        nb: 'Beskrivelse'
      }
    }
  };
  wrapper = shallow(<FormCatalogPure {...defaultProps} />);
});

test('should render FormCatalogPure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
