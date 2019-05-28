import React from 'react';
import { shallow } from 'enzyme';
import {
  FormAccessRights,
  renderLegalBasis
} from './form-accessRights.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    syncErrors: null,
    hasAccessRightsURI: 'hasAccessRightsURI',
    fields: [
      { _isFieldArray: true, length: 1, name: 'legalBasisForRestriction' }
    ]
  };
  wrapper = shallow(<FormAccessRights {...defaultProps} />);
});

test('should render FormAccessRights correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render FormAccessRights correctly with syncErrors', () => {
  wrapper.setProps({
    syncErrors: {
      accessRight: {
        nb: 'Feil'
      }
    },
    hasAccessRightsURI:
      'http://publications.europa.eu/resource/authority/access-right/RESTRICTED'
  });
  expect(wrapper).toMatchSnapshot();
});

test('should render renderLegalBasis correctly', () => {
  wrapper = shallow(renderLegalBasis(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
