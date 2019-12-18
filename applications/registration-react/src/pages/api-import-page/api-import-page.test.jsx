import React from 'react';
import { shallow } from 'enzyme';
import { ApiImportPagePure } from './api-import-page-pure';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ApiImportPagePure />);
});

test('should render ApiImportPagePure correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
