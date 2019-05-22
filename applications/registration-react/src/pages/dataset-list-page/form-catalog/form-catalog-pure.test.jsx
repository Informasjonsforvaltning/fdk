import React from 'react';
import { shallow } from 'enzyme';
import { FormCatalogPure } from './form-catalog-pure';
import helptext from '../../../../test/fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    helptextItems,
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
