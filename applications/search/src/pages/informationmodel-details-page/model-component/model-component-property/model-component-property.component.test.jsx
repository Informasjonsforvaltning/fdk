import React from 'react';
import { shallow } from 'enzyme';
import { ModelComponentProperty } from './model-component-property.component';

test('should render ModelComponentProperty with props', () => {
  const defaultProps = {
    name: 'Test property',
    type: 'type',
    typeRef: null,
    oneOfTypeRefs: null
  };
  const wrapper = shallow(<ModelComponentProperty {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
