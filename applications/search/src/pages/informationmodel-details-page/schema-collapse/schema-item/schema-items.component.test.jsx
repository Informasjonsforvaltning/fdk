import React from 'react';
import { shallow } from 'enzyme';
import { SchemaItem } from './schema-items.component';

test('should render SchemaItem with props', () => {
  const defaultProps = {
    title: 'Tittel',
    type: 'Type',
    marginLeft: '16'
  };
  const wrapper = shallow(<SchemaItem {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
