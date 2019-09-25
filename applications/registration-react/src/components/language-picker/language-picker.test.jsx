import React from 'react';
import { shallow } from 'enzyme';
import LanguagePicker from './language-picker.component';

let defaultProps;
let wrapper;

beforeEach(() => {
  defaultProps = {
    languages: [],
    toggleInputLanguage: () => {}
  };
  wrapper = shallow(<LanguagePicker {...defaultProps} />);
});

test('should render LanguagePicker correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
