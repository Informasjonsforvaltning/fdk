import React from 'react';
import { shallow } from 'enzyme';
import Helptext from './helptext.component';
import helptext from '../../../test/fixtures/helptext';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { helptextItems } = helptext;
  defaultProps = {
    title: 'Title',
    required: false,
    helptextItems
  };
  wrapper = shallow(<Helptext {...defaultProps} />);
});

test('should render Helptext correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
