import React from 'react';
import { shallow } from 'enzyme';
import { DatasetInfo } from './dataset-info.component';
import dataset from '../__fixtures/datasetApiResponse.json';

test('should render DatasetInfo correctly with no props', () => {
  const minWrapper = shallow(<DatasetInfo />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render DatasetInfo correctly', () => {
  const defaultProps = {
    datasetItem: {
      ...dataset,
      temporal: [
        {
          startDate: 1483228800000,
          endDate: 1514764799000
        }
      ],
      spatial: [
        {
          uri: 'http://www.geonames.org/3162656/asker.html',
          prefLabel: {
            nb: 'Asker'
          }
        },
        {
          uri: 'http://www.geonames.org/3162212/baerum.html',
          prefLabel: {
            nb: 'Bærum'
          }
        },
        {
          uri: 'http://www.geonames.org/3151404/hurum.html',
          prefLabel: {
            nb: 'Hurum'
          }
        },
        {
          uri: 'http://www.geonames.org/3141104/royken.html',
          prefLabel: {
            nb: 'Røyken'
          }
        }
      ],
      references: [
        {
          referenceType: {
            uri: 'http://www.w3.org/2002/07/hasVersion',
            code: 'hasVersion',
            prefLabel: {
              nb: 'Har versjon'
            }
          },
          source: {
            uri: 'http://referenced/dataset',
            title: {
              nb: 'The first one'
            },
            description: {},
            contactPoint: [],
            legalBasisForRestriction: [],
            legalBasisForProcessing: [],
            legalBasisForAccess: [],
            registrationStatus: 'DRAFT'
          }
        }
      ]
    }
  };
  const wrapper = shallow(<DatasetInfo {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
