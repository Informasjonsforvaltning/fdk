import React from 'react';
import { shallow } from 'enzyme';
import { InputTagsDatasetsField } from './field-tagsinput-datasets.components';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    input: {
      name: 'datasetReferences',
      value: [
        'http://brreg.no/catalogs/910244132/datasets/6deb833c-4600-4377-8f9b-db0aacf12710',
        'http://brreg.no/catalogs/910244132/datasets/6deb833c-4600-4377-8f9b-db0aacf12711'
      ]
    },
    referencedDatasets: [
      {
        id: 'efe0948d-c029-4e61-a99a-b0a6fcb420ae',
        uri:
          'http://brreg.no/catalogs/910244132/datasets/6deb833c-4600-4377-8f9b-db0aacf12710',
        title: {
          nb: 'Tittel datasett'
        }
      },
      {
        id: 'efe0948d-c029-4e61-a99a-b0a6fcb420ae',
        uri:
          'http://brreg.no/catalogs/910244132/datasets/6deb833c-4600-4377-8f9b-db0aacf12711',
        title: {
          nb: 'Tittel datasett 1'
        }
      }
    ]
  };
  wrapper = shallow(<InputTagsDatasetsField {...defaultProps} />);
});

test('should render InputTagsDatasetsField correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
