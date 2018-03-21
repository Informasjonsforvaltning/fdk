import React from 'react';
import BegrepCollapse from '../../../src/components/search-dataset-begrep-collapse';

describe('BegrepCollapse', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<BegrepCollapse />);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('.fdk-container-detail-begrep')).to.have.length(1);
  });

  it('collapses when the button clicked', () => {
    const wrapper = mount(<BegrepCollapse />);

    expect(wrapper.state().detailed).to.equal(false);

    wrapper.find('.fdk-container-begrep').simulate('click');
    expect(wrapper.state().detailed).to.equal(true);

    wrapper.find('.fdk-container-begrep').simulate('click');
    expect(wrapper.state().detailed).to.equal(false);
  });
});
