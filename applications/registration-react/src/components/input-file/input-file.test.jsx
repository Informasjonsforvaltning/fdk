import React from 'react';
import { shallow } from 'enzyme';
import { InputFile } from './input-file.component';

test('should render InputFile success correctly with props', () => {
  const wrapper = shallow(<InputFile type="success">Velg fil</InputFile>);
  expect(wrapper).toMatchSnapshot();
});
