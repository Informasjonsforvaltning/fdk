import React from 'react';
import DatasetPublish from '../../../src/components/reg-form-dataset-publish';

describe('Publish dataset', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DatasetPublish/>);
  });

  it('should render', () => {
    expect(wrapper).to.have.length(1);
  });

  it('show warning if errors when publish button clicked', () => {
    expect(wrapper.state().showPublishModal).to.equal(false);

    wrapper.setProps({ registrationStatus: 'DRAFT'});
    wrapper.setProps({ syncErrors: 'Errors' });
    wrapper.find('#dataset-setPublish-button').simulate('click');
    expect(wrapper.state().showPublishModal).to.equal(true);
  });


  it('show no warning if errors when draft button clicked', () => {
    expect(wrapper.state().showPublishModal).to.equal(false);

    wrapper.setProps({ registrationStatus: 'PUBLISH'});
    wrapper.setProps({ syncErrors: 'Errors' });
    wrapper.find('#dataset-setDraft-button').simulate('click');
    expect(wrapper.state().showPublishModal).to.equal(false);
  });
});
