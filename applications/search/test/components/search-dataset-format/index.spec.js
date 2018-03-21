import React from 'react';
import Format from '../../../src/components/search-dataset-format';

describe('Format', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Format />);
  });

  it('should render', () => {
    expect(wrapper).to.have.length(1);
  });

  it('should render format as public with format type', () => {
    wrapper.setProps({
      code: "PUBLIC",
      type: "test",
      text: "application/json"
    });
    expect(wrapper.find('.fdk-label-distribution-offentlig').length).to.equal(1);
    expect(wrapper.find('.fdk-distribution-format').length).to.equal(1);
  });

  it('should render format as restricted', () => {
    wrapper.setProps({
      code: "RESTRICTED",
      text: "application/json"
    });
    expect(wrapper.find('.fdk-label-distribution-begrenset').length).to.equal(1);
    expect(wrapper.find('.fdk-distribution-format').length).to.equal(0);
  });

  it('should render format as non-public', () => {
    wrapper.setProps({
      code: "NON-PUBLIC",
      text: "application/json"
    });
    expect(wrapper.find('.fdk-label-distribution-skjermet').length).to.equal(1);
  });
});
