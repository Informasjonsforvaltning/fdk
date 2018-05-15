import React from 'react';
import { shallow } from 'enzyme';
import DatasetPublish from '../../../src/components/reg-form-dataset-publish';

let defaultProps, wrapper, dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    registrationStatus: 'DRAFT',
    syncErrors: false,
    distributionErrors: null,
    lastSaved: 'yesterday'
  };
  wrapper = shallow(<DatasetPublish {...defaultProps} />);
});

test('should render DatasetPublish correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
