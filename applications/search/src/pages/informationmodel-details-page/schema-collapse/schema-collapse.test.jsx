import React from 'react';
import { shallow } from 'enzyme';
import { SchemaCollapsePure } from './schema-collapse.component';

test('should render SchemaCollapsePure correctly with no props', () => {
  const wrapperWithNoProps = shallow(<SchemaCollapsePure />);
  expect(wrapperWithNoProps).toMatchSnapshot();
});

test('should render SchemaCollapsePure with props', () => {
  const defaultProps = {
    title: 'Tittel',
    type: 'Type',
    marginLeft: '16',
    nestLevel: 1
  };
  const wrapper = shallow(<SchemaCollapsePure {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
