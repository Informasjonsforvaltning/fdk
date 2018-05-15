import React from 'react';
import { shallow } from 'enzyme';
import { FormAccessRights } from '../../../src/components/reg-form-schema-accessRights';
import helptext from '../../fixtures/helptext';

let defaultProps, wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    syncErrors: null,
    helptextItems,
    hasAccessRightsURI: 'hasAccessRightsURI'
  };
  wrapper = shallow(<FormAccessRights {...defaultProps} />);
});

test('should render FormAccessRights correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
