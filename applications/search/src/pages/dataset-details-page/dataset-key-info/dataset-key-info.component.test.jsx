import React from 'react';
import { shallow } from 'enzyme';
import { DatasetKeyInfo } from './dataset-key-info.component';
import dataset from '../__fixtures/datasetApiResponse.json';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    accessRights: dataset.accessRights,
    legalBasisForRestriction: dataset.legalBasisForRestriction,
    legalBasisForProcessing: dataset.legalBasisForProcessing,
    legalBasisForAccess: dataset.legalBasisForAccess,
    type: dataset.type,
    conformsTo: dataset.conformsTo,
    informationModel: dataset.informationModel
  };
  wrapper = shallow(<DatasetKeyInfo {...defaultProps} />);
});

test('should render DatasetKeyInfo correctly with no props', () => {
  const minWrapper = shallow(<DatasetKeyInfo />);
  expect(minWrapper).toMatchSnapshot();
});

test('should render DatasetKeyInfo correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
