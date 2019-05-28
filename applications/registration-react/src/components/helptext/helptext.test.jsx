import React from 'react';
import { shallow } from 'enzyme';
import { Helptext } from './helptext.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    title: 'Title',
    required: false,
    term: 'Catalog_title'
  };
  wrapper = shallow(<Helptext {...defaultProps} />);
});

test('should render Helptext correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
