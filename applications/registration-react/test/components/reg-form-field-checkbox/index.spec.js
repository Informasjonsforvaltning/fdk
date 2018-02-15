import React from 'react';
import CheckboxField from '../../../src/components/reg-form-field-checkbox';

describe('CheckboxField type', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CheckboxField/>);
  });

  it('should render', () => {
    expect(wrapper).to.have.length(1);
    expect(wrapper.find('.fdk-form-checkbox')).to.have.length(3);
  });
});
