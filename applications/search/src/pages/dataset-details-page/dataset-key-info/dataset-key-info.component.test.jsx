import React from 'react';
import { shallow } from 'enzyme';
import { DatasetKeyInfo } from './dataset-key-info.component';
import datasets from '../../../../test/fixtures/datasets';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { _source } = datasets[0];
  defaultProps = {
    accessRights: _source.accessRights,
    legalBasisForRestriction: _source.legalBasisForRestriction,
    legalBasisForProcessing: _source.legalBasisForProcessing,
    legalBasisForAccess: _source.legalBasisForAccess,
    type: _source.type,
    conformsTo: _source.conformsTo,
    informationModel: _source.informationModel,
    selectedLanguageCode: null
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
