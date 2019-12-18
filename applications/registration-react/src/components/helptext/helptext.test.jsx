import React from 'react';
import { shallow } from 'enzyme';
import { HelpTextPure } from './helptext.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    title: 'Title',
    required: false,
    term: 'Catalog_title'
  };
  wrapper = shallow(<HelpTextPure {...defaultProps} />);
});

test('should render HelpTextPure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
