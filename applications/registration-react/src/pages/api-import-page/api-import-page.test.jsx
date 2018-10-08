import React from 'react';
import { shallow } from 'enzyme';
import { ApiImportPage } from './api-import-page';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ApiImportPage />);
});

test('should render ApiImportPage correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
