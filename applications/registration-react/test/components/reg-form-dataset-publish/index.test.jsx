import React from 'react';
import { shallow } from 'enzyme';
import DatasetPublish from '../../../src/components/reg-form-dataset-publish';

let defaultProps;
let wrapper;
let dispatch;

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

test('should handle PUBLISH', () => {
  wrapper
    .find('Button')
    .first()
    .simulate('click');
  expect(wrapper.state().showPublishInfo).toBeTruthy();
});

test('show warning if errors when publish button clicked', () => {
  wrapper.setProps({ registrationStatus: 'DRAFT' });
  wrapper.setProps({ syncErrors: true });
  wrapper.find('#dataset-setPublish-button').simulate('click');
  expect(wrapper.state().showPublishModal).toBeTruthy();
});

test('show no warning if errors when draft button clicked', () => {
  wrapper.setProps({ registrationStatus: 'PUBLISH' });
  wrapper.setProps({ syncErrors: true });
  wrapper.find('#dataset-setDraft-button').simulate('click');
  expect(wrapper.state().showPublishModal).not.toBeTruthy();
});
